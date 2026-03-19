"""
FastAPI backend for Causal Market Regime Detection.

This API-only service provides regime detection, probability estimation,
and Monte Carlo stability analysis for multiple asset classes.

Run with: uvicorn api.main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Union
from datetime import datetime
import numpy as np
import traceback

# Import core modules
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.data.loader import DataLoader
from src.data.features import FeatureEngine
from src.regime.classifier import RegimeClassifier
from src.regime.rules import RuleBasedLabeler
from src.monte_carlo.simulator import MonteCarloSimulator
from api.regime_tester import router as regime_router


# ============================================================================
# Pydantic Response Models
# ============================================================================

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str = "1.0.0"


class AssetInfo(BaseModel):
    id: str
    label: str
    ticker: str
    badge: str
    category: str


class AssetsResponse(BaseModel):
    assets: List[AssetInfo]


class RegimeResponse(BaseModel):
    ticker: str
    currentRegime: str
    confidence: float
    timestamp: str


class ProbabilitiesResponse(BaseModel):
    ticker: str
    probabilities: Dict[str, float]
    timestamp: str


class MonteCarloResponse(BaseModel):
    ticker: str
    stabilityScore: float
    transitionProbability: float
    horizonDays: int
    regimeDistribution: Dict[str, int]
    nSimulations: int
    var95: float
    var99: float
    expectedReturn: float
    volatility: float
    returnDistribution: List[Dict[str, Union[str, float, int]]]
    timestamp: str


class ErrorResponse(BaseModel):
    error: bool = True
    message: str
    code: str


class AnalysisResponse(BaseModel):
    ticker: str
    regime: str
    technicalIndices: Dict[str, float]
    structuralBreaks: Dict[str, Union[str, float, int]]
    timestamp: str



# ============================================================================
# Asset Configuration
# ============================================================================

ASSETS = [
    {"id": "sp500", "label": "S&P 500", "ticker": "^GSPC", "badge": "US Equity", "category": "indices"},
    {"id": "nifty", "label": "NIFTY 50", "ticker": "^NSEI", "badge": "IN Equity", "category": "indices"},
    {"id": "banknifty", "label": "Bank Nifty", "ticker": "^NSEBANK", "badge": "IN Index", "category": "indices"},
    {"id": "btc", "label": "Bitcoin", "ticker": "BTC-USD", "badge": "Crypto", "category": "crypto"},
    {"id": "eth", "label": "Ethereum", "ticker": "ETH-USD", "badge": "Crypto", "category": "crypto"},
    {"id": "sol", "label": "Solana", "ticker": "SOL-USD", "badge": "Crypto", "category": "crypto"},
    {"id": "xrp", "label": "XRP", "ticker": "XRP-USD", "badge": "Crypto", "category": "crypto"},
    {"id": "xaud", "label": "Gold (XAU/USD)", "ticker": "GC=F", "badge": "Commodity", "category": "commodities"},
    {"id": "cl", "label": "Light Crude Oil", "ticker": "CL=F", "badge": "Commodity", "category": "commodities"},
    {"id": "us30", "label": "US 30", "ticker": "^DJI", "badge": "US Equity", "category": "indices"},
]


# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(
    title="Causal Market Regime Detection API",
    description="Uncertainty-aware market regime detection with Monte Carlo stability analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(regime_router, prefix="/api")


# ============================================================================
# Helper Functions
# ============================================================================

def get_ticker_from_id(asset_id: str) -> Optional[str]:
    """Get ticker symbol from asset ID."""
    for asset in ASSETS:
        if asset["id"] == asset_id:
            return asset["ticker"]
    return None


def process_regime_data(ticker: str):
    """
    Full pipeline: load data, compute features, label regimes, classify.
    Returns (data_with_features, classifier, current_regime, confidence)
    """
    # Load market data
    loader = DataLoader()
    data = loader.load_data(ticker=ticker)
    
    if data is None or data.empty:
        raise ValueError(f"No data available for {ticker}")
    
    # Engineer features
    feature_eng = FeatureEngine()
    data = feature_eng.compute_features(data)
    
    # Apply rule-based labels
    labeler = RuleBasedLabeler()
    data = labeler.label_dataframe(data)
    
    # Train classifier
    classifier = RegimeClassifier()
    classifier.fit_full(data)
    
    # Get current regime
    current_regime, confidence = classifier.get_current_regime(data)
    
    return data, classifier, current_regime, confidence


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health status."""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat()
    )


@app.get("/assets", response_model=AssetsResponse)
async def get_assets():
    """Get list of available assets."""
    try:
        assets = [AssetInfo(**asset) for asset in ASSETS]
        return AssetsResponse(assets=assets)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/regime/{asset_id}", response_model=RegimeResponse)
async def get_regime(asset_id: str):
    """Get current dominant regime for an asset."""
    try:
        ticker = get_ticker_from_id(asset_id)
        if not ticker:
            raise HTTPException(status_code=404, detail=f"Asset '{asset_id}' not found")
        
        data, classifier, current_regime, confidence = process_regime_data(ticker)
        
        return RegimeResponse(
            ticker=ticker,
            currentRegime=current_regime,
            confidence=round(confidence, 1),
            timestamp=datetime.utcnow().isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute regime: {str(e)}"
        )


@app.get("/probabilities/{asset_id}", response_model=ProbabilitiesResponse)
async def get_probabilities(asset_id: str):
    """Get probability distribution across regimes."""
    try:
        ticker = get_ticker_from_id(asset_id)
        if not ticker:
            raise HTTPException(status_code=404, detail=f"Asset '{asset_id}' not found")
        
        data, classifier, _, _ = process_regime_data(ticker)
        
        # Get smoothed probabilities
        proba = classifier.predict_proba_smoothed(data)
        latest = proba.iloc[-1].to_dict()
        
        # Round values
        probabilities = {k: round(v, 3) for k, v in latest.items()}
        
        return ProbabilitiesResponse(
            ticker=ticker,
            probabilities=probabilities,
            timestamp=datetime.utcnow().isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute probabilities: {str(e)}"
        )


@app.get("/monte-carlo/{asset_id}", response_model=MonteCarloResponse)
async def get_monte_carlo(asset_id: str, simulations: int = 1000, horizon: int = 20):
    """Run Monte Carlo stability analysis."""
    try:
        ticker = get_ticker_from_id(asset_id)
        if not ticker:
            raise HTTPException(status_code=404, detail=f"Asset '{asset_id}' not found")
        
        # Get regime data
        data, classifier, current_regime, confidence = process_regime_data(ticker)
        
        # Compute Monte Carlo parameters
        returns = data["price"].pct_change().dropna()
        mean_return = returns.tail(60).mean()
        volatility = returns.tail(20).std()
        current_price = data["price"].iloc[-1]
        historical_prices = data["price"].tail(100).values
        
        # Run simulation
        simulator = MonteCarloSimulator(
            n_simulations=min(simulations, 5000),  # Cap at 5000
            horizon_days=min(horizon, 60)  # Cap at 60 days
        )
        
        results = simulator.simulate(
            current_price=current_price,
            mean_return=mean_return,
            volatility=volatility,
            current_regime=current_regime,
            historical_prices=historical_prices
        )
        
        return MonteCarloResponse(
            ticker=ticker,
            stabilityScore=results["stability_score"],
            transitionProbability=results["transition_probability"],
            horizonDays=results["horizon_days"],
            regimeDistribution=results["regime_distribution"],
            nSimulations=results["n_simulations"],
            var95=results["var95"],
            var99=results["var99"],
            expectedReturn=results["expected_return"],
            volatility=results["volatility"],
            returnDistribution=results["return_distribution"],
            timestamp=datetime.utcnow().isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to run Monte Carlo simulation: {str(e)}"
        )


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler to prevent crashes."""
    return {
        "error": True,
        "message": str(exc),
        "code": "INTERNAL_ERROR"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
