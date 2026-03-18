"""
Monte Carlo regime stability simulation module.

This module quantifies regime stability under uncertainty by simulating
future price paths and measuring how often the current regime persists.

Methodology:
1. Take current regime belief from classifier
2. Simulate N future price paths using simple stochastic returns:
   - Mean = recent average return
   - Volatility = recent realized volatility
3. Recompute features and regime labels for each simulation
4. Measure regime persistence across simulations

Outputs:
- Regime Stability Score (0-100%): Percentage of paths where regime persists
- Transition Probability: Chance of regime change within horizon

NOTE: Monte Carlo is kept simple and interpretable - no complex GBM extensions.
"""

import numpy as np
import pandas as pd
from typing import Tuple, Dict

from ..config import (
    MC_DEFAULT_SIMULATIONS,
    MC_DEFAULT_HORIZON_DAYS,
    VOLATILITY_SHORT_WINDOW,
    VOLATILITY_LONG_WINDOW,
    TREND_WINDOW,
    HIGH_VOLATILITY_THRESHOLD,
    REGIME_HIGH_VOLATILITY,
    REGIME_TRENDING,
    REGIME_RANGE_BOUND
)


class MonteCarloSimulator:
    """
    Monte Carlo simulator for regime stability analysis.
    
    This simulator quantifies uncertainty in regime classification by:
    1. Generating stochastic future price paths
    2. Computing features for each path
    3. Applying regime rules to determine regime at horizon
    4. Measuring how stable the current regime is across simulations
    
    The simulation uses simple random walk with drift:
    P(t+1) = P(t) * exp(mu - 0.5*sigma^2 + sigma*Z)
    where Z ~ N(0,1)
    
    This is interpretable and computationally efficient.
    """
    
    def __init__(
        self,
        n_simulations: int = MC_DEFAULT_SIMULATIONS,
        horizon_days: int = MC_DEFAULT_HORIZON_DAYS,
        high_vol_threshold: float = HIGH_VOLATILITY_THRESHOLD
    ):
        """
        Initialize Monte Carlo simulator.
        
        Args:
            n_simulations: Number of price paths to simulate
            horizon_days: Days to simulate forward
            high_vol_threshold: Threshold for high volatility regime
        """
        self.n_simulations = n_simulations
        self.horizon_days = horizon_days
        self.high_vol_threshold = high_vol_threshold
    
    def simulate_price_paths(
        self,
        current_price: float,
        mean_return: float,
        volatility: float,
        seed: int = None
    ) -> np.ndarray:
        """
        Simulate future price paths using vectorized operations.
        
        Uses geometric Brownian motion (GBM) for price evolution:
        dP = mu*P*dt + sigma*P*dW
        
        Args:
            current_price: Starting price
            mean_return: Daily expected return
            volatility: Daily volatility (std of returns)
            seed: Random seed for reproducibility
            
        Returns:
            Array of shape (n_simulations, horizon_days) with prices
        """
        if seed is not None:
            np.random.seed(seed)
        
        # Vectorized simulation of all paths at once
        # Shape: (n_simulations, horizon_days)
        random_shocks = np.random.standard_normal(
            (self.n_simulations, self.horizon_days)
        )
        
        # Daily returns using log-normal model
        drift = mean_return - 0.5 * volatility ** 2
        daily_returns = np.exp(
            drift + volatility * random_shocks
        )
        
        # Cumulative price paths
        price_paths = np.zeros((self.n_simulations, self.horizon_days))
        price_paths[:, 0] = current_price * daily_returns[:, 0]
        
        for t in range(1, self.horizon_days):
            price_paths[:, t] = price_paths[:, t-1] * daily_returns[:, t]
        
        return price_paths
    
    def _compute_path_features(
        self,
        price_path: np.ndarray,
        historical_prices: np.ndarray
    ) -> Dict[str, float]:
        """
        Compute regime features for a single simulated path.
        
        Args:
            price_path: Simulated future prices
            historical_prices: Recent historical prices for context
            
        Returns:
            Dictionary with volatility and trend features
        """
        # Combine historical and simulated prices
        full_prices = np.concatenate([historical_prices, price_path])
        
        # Compute returns
        returns = np.diff(full_prices) / full_prices[:-1]
        
        # Use last 20 days for short-term volatility
        vol_20d = np.std(returns[-VOLATILITY_SHORT_WINDOW:])
        
        # Use last 60 days for long-term volatility (or available)
        available_for_long = min(len(returns), VOLATILITY_LONG_WINDOW)
        vol_60d = np.std(returns[-available_for_long:])
        
        # Trend: price change over 60 days (or available)
        if len(full_prices) > TREND_WINDOW:
            trend_60d = (full_prices[-1] - full_prices[-TREND_WINDOW-1]) / full_prices[-TREND_WINDOW-1]
        else:
            trend_60d = (full_prices[-1] - full_prices[0]) / full_prices[0]
        
        return {
            "volatility_20d": vol_20d,
            "volatility_60d": vol_60d,
            "trend_60d": trend_60d
        }
    
    def _label_regime(self, features: Dict[str, float]) -> str:
        """
        Apply regime rules to features.
        
        Args:
            features: Dictionary with volatility and trend values
            
        Returns:
            Regime label string
        """
        if features["volatility_20d"] > features["volatility_60d"] * self.high_vol_threshold:
            return REGIME_HIGH_VOLATILITY
        elif features["trend_60d"] > 0:
            return REGIME_TRENDING
        else:
            return REGIME_RANGE_BOUND
    
    def simulate(
        self,
        current_price: float,
        mean_return: float,
        volatility: float,
        current_regime: str,
        historical_prices: np.ndarray
    ) -> Dict[str, float]:
        """
        Run Monte Carlo simulation and compute stability metrics.
        
        Args:
            current_price: Current market price
            mean_return: Recent average daily return
            volatility: Recent daily volatility
            current_regime: Current regime label
            historical_prices: Recent price history for feature computation
            
        Returns:
            Dictionary with:
            - stability_score: % of simulations where regime persists (0-100)
            - transition_probability: % chance of regime change (0-100)
            - regime_distribution: Dict of regime -> count
            - var95: 95% Value at Risk (percentage)
            - var99: 99% Value at Risk (percentage)
            - expected_return: Expected percentage return over horizon
            - volatility: Volatility of simulated returns
            - return_distribution: Histogram of returns for plotting
        """
        # Simulate price paths
        price_paths = self.simulate_price_paths(
            current_price, mean_return, volatility
        )
        
        # Calculate returns at the end of horizon for each path
        final_prices = price_paths[:, -1]
        total_returns = (final_prices - current_price) / current_price * 100  # As percentage
        
        # Compute Risk Metrics
        var95 = np.percentile(total_returns, 5)
        var99 = np.percentile(total_returns, 1)
        expected_return = np.mean(total_returns)
        sim_volatility = np.std(total_returns)
        
        # Compute Distribution for Histogram
        # Create bins from min to max return
        counts, bin_edges = np.histogram(total_returns, bins=30)
        return_distribution = []
        for i in range(len(counts)):
            bin_center = (bin_edges[i] + bin_edges[i+1]) / 2
            return_distribution.append({
                "range": f"{bin_center:.1f}%",
                "count": int(counts[i]),
                "value": float(bin_center)
            })

        # Count regime outcomes
        regime_counts = {
            REGIME_HIGH_VOLATILITY: 0,
            REGIME_TRENDING: 0,
            REGIME_RANGE_BOUND: 0
        }
        same_regime_count = 0
        
        for i in range(self.n_simulations):
            # Get simulated path
            path = price_paths[i, :]
            
            # Compute features at end of horizon
            features = self._compute_path_features(path, historical_prices)
            
            # Label regime
            end_regime = self._label_regime(features)
            regime_counts[end_regime] += 1
            
            # Check if same as current
            if end_regime == current_regime:
                same_regime_count += 1
        
        # Compute metrics
        stability_score = (same_regime_count / self.n_simulations) * 100
        transition_probability = 100 - stability_score
        
        return {
            "stability_score": round(stability_score, 1),
            "transition_probability": round(transition_probability, 1),
            "regime_distribution": regime_counts,
            "horizon_days": self.horizon_days,
            "n_simulations": self.n_simulations,
            "var95": round(var95, 2),
            "var99": round(var99, 2),
            "expected_return": round(expected_return, 2),
            "volatility": round(sim_volatility, 2),
            "return_distribution": return_distribution
        }
    
    def generate_explanation(
        self,
        current_regime: str,
        confidence: float,
        stability_results: Dict
    ) -> str:
        """
        Generate natural-language explanation of stability analysis.
        
        Args:
            current_regime: Current regime name
            confidence: Classifier confidence (0-100)
            stability_results: Results from simulate()
            
        Returns:
            Human-readable explanation string
        """
        stability = stability_results["stability_score"]
        transition = stability_results["transition_probability"]
        horizon = stability_results["horizon_days"]
        
        explanation = (
            f"The market is currently in a **{current_regime}** regime "
            f"with **{confidence:.1f}%** confidence. "
            f"Monte Carlo simulations ({stability_results['n_simulations']:,} paths) "
            f"indicate a **{transition:.1f}%** probability of regime transition "
            f"within the next **{horizon}** trading days."
        )
        
        # Add stability interpretation
        if stability >= 80:
            explanation += " The current regime appears **highly stable**."
        elif stability >= 60:
            explanation += " The current regime shows **moderate stability**."
        elif stability >= 40:
            explanation += " There is **elevated uncertainty** about regime persistence."
        else:
            explanation += " The regime is **likely to transition** soon."
        
        return explanation
