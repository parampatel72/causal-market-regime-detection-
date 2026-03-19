"""
Regime Tester API endpoints.

New isolated module — does NOT modify any existing API logic.
Provides:
  POST /api/regime/historical  — full backtest over a date range
  POST /api/regime/live        — current regime detection (single or all assets)

Run via the main app:
  uvicorn api.main:app --reload
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Union
import traceback

try:
    import yfinance as yf
except ImportError:
    yf = None  # handled gracefully at call time

router = APIRouter()


# ============================================================================
# Asset Configuration
# ============================================================================

REGIME_ASSETS = {
    "S&P 500":   "^GSPC",
    "NIFTY 50":  "^NSEI",
    "GOLD":      "GC=F",
    "Bitcoin":   "BTC-USD",
    "BANKNIFTY": "^NSEBANK",
    "Crude Oil": "CL=F",
    "Ethereum":  "ETH-USD",
    "Solana":    "SOL-USD",
    "XRP":       "XRP-USD",
    "US30":      "^DJI",
}


# ============================================================================
# Core Logic (exact — do not modify)
# ============================================================================

def add_features(df):
    df["returns"]        = df["price"].pct_change()
    df["volatility_20d"] = df["returns"].rolling(20).std()
    df["volatility_60d"] = df["returns"].rolling(60).std()
    df["trend_60d"]      = df["price"].pct_change(60)
    df.dropna(inplace=True)
    return df


def rule_based_regime(row):
    if row["volatility_20d"] > row["volatility_60d"] * 1.3:
        return "High Volatility"
    elif row["trend_60d"] > 0 and row["volatility_20d"] < row["volatility_60d"]:
        return "Trending"
    else:
        return "Range-Bound"


# ============================================================================
# Pydantic Request Models
# ============================================================================

class HistoricalRequest(BaseModel):
    ticker: str
    name: str = ""
    start_date: str = "2015-01-01"
    end_date: Optional[str] = None


class LiveRequest(BaseModel):
    ticker: str           # ticker symbol or "all"
    name: Optional[str] = ""


# ============================================================================
# Endpoint: Historical Backtest
# ============================================================================

@router.post("/regime/historical")
async def regime_historical(req: HistoricalRequest):
    """
    Download historical data for a ticker, apply feature engineering and
    rule-based regime labelling, return chart data + distribution stats.
    """
    if yf is None:
        return {
            "success": False,
            "error": "yfinance is not installed. Run: pip install yfinance",
            "ticker": req.ticker,
        }

    try:
        import pandas as pd
        from datetime import date

        end_date = req.end_date or str(date.today())

        raw = yf.download(
            req.ticker,
            start=req.start_date,
            end=end_date,
            auto_adjust=True,
            progress=False,
            multi_level_index=False,
        )

        if raw is None or raw.empty:
            return {
                "success": False,
                "error": f"No data returned for ticker '{req.ticker}'.",
                "ticker": req.ticker,
            }

        # Flatten multi-level columns if present
        if hasattr(raw.columns, "levels"):
            raw.columns = [col[0] if isinstance(col, tuple) else col for col in raw.columns]

        # Keep only Close and Volume
        cols_needed = [c for c in ["Close", "Volume"] if c in raw.columns]
        df = raw[cols_needed].copy()
        df.columns = ["price"] + (["volume"] if "Volume" in cols_needed else [])

        df = add_features(df)
        df["regime"] = df.apply(rule_based_regime, axis=1)

        total_days = len(df)
        current_regime = df["regime"].iloc[-1]
        first_regime   = df["regime"].iloc[0]

        # Distribution
        counts = df["regime"].value_counts()
        distribution = {}
        for regime_name in ["Trending", "Range-Bound", "High Volatility"]:
            cnt = int(counts.get(regime_name, 0))
            distribution[regime_name] = {
                "count": cnt,
                "percentage": round(cnt / total_days * 100, 1) if total_days else 0,
            }

        # Chart data — sample to max 1000 points for performance
        sample_df = df
        if len(df) > 1000:
            step = len(df) // 1000
            sample_df = df.iloc[::step]

        chart_data = [
            {
                "date": str(idx.date()),
                "price": round(float(row["price"]), 2),
                "regime": row["regime"],
            }
            for idx, row in sample_df.iterrows()
        ]

        return {
            "success": True,
            "ticker": req.ticker,
            "name": req.name,
            "start_date": req.start_date,
            "end_date": end_date,
            "total_days": total_days,
            "current_regime": current_regime,
            "first_regime": first_regime,
            "distribution": distribution,
            "chart_data": chart_data,
            "error": None,
        }

    except Exception as exc:
        traceback.print_exc()
        return {
            "success": False,
            "error": str(exc),
            "ticker": req.ticker,
        }


# ============================================================================
# Endpoint: Live Detection (single or all)
# ============================================================================

def _run_live_single(ticker: str, name: str) -> dict:
    """Run live detection for one ticker. Returns a result dict."""
    try:
        import pandas as pd
        from datetime import date

        raw = yf.download(
            ticker,
            period="90d",
            interval="1d",
            auto_adjust=True,
            progress=False,
            multi_level_index=False,
        )

        if raw is None or raw.empty:
            return {
                "success": False,
                "ticker": ticker,
                "name": name,
                "error": f"No data returned for ticker '{ticker}'.",
            }

        # Flatten multi-level columns if present
        if hasattr(raw.columns, "levels"):
            raw.columns = [col[0] if isinstance(col, tuple) else col for col in raw.columns]

        cols_needed = [c for c in ["Close", "Volume"] if c in raw.columns]
        df = raw[cols_needed].copy()
        df.columns = ["price"] + (["volume"] if "Volume" in cols_needed else [])

        df = add_features(df)
        df["regime"] = df.apply(rule_based_regime, axis=1)

        latest = df.iloc[-1]
        regime      = latest["regime"]
        vol20       = float(latest["volatility_20d"])
        vol60       = float(latest["volatility_60d"])
        trend60     = float(latest["trend_60d"])
        price       = round(float(latest["price"]), 2)
        latest_date = str(df.index[-1].date())

        # Confidence
        if regime == "High Volatility":
            confidence = "Strong" if vol20 / vol60 > 1.5 else "Moderate"
        elif regime == "Trending":
            confidence = "Strong" if abs(trend60) > 0.05 else "Moderate"
        else:
            confidence = "Moderate"

        # Stability — last 5 days
        last5 = list(df["regime"].tail(5))
        matching = sum(1 for r in last5 if r == regime)
        if matching >= 4:
            stability = "Stable"
        elif matching >= 3:
            stability = "Transitioning"
        else:
            stability = "Changing"

        return {
            "success": True,
            "ticker": ticker,
            "name": name,
            "date": latest_date,
            "price": price,
            "regime": regime,
            "confidence": confidence,
            "stability": stability,
            "volatility_20d": round(vol20, 6),
            "trend_60d": round(trend60, 6),
            "history": last5,
            "error": None,
        }

    except Exception as exc:
        traceback.print_exc()
        return {
            "success": False,
            "ticker": ticker,
            "name": name,
            "error": str(exc),
        }


@router.post("/regime/live")
async def regime_live(req: LiveRequest):
    """
    Detect current regime for a single asset or all configured assets.

    Body:
        {"ticker": "GC=F", "name": "GOLD"}          — single
        {"ticker": "all"}                             — scan all 10 assets
    """
    if yf is None:
        return {
            "success": False,
            "error": "yfinance is not installed. Run: pip install yfinance",
            "ticker": req.ticker,
        }

    if req.ticker.lower() == "all":
        results = []
        for asset_name, asset_ticker in REGIME_ASSETS.items():
            result = _run_live_single(asset_ticker, asset_name)
            results.append(result)
        return results

    # Single asset
    name = req.name or req.ticker
    return _run_live_single(req.ticker, name)
