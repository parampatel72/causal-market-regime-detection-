"""
Configuration module for Uncertainty-Aware Causal Market Regime Detection MVP.

This module centralizes all configuration constants for easy modification
and future extension to multiple assets.
"""

# Default market settings
DEFAULT_TICKER = "^GSPC"  # S&P 500
DEFAULT_START_DATE = "2015-01-01"

# Available markets
MARKETS = {
    "S&P 500 (US)": "^GSPC",
    "NIFTY 50 (India)": "^NSEI",
}

# Feature engineering parameters
VOLATILITY_SHORT_WINDOW = 20   # Short-term volatility lookback (days)
VOLATILITY_LONG_WINDOW = 60    # Long-term volatility lookback (days)
TREND_WINDOW = 60              # Trend strength lookback (days)

# Regime labeling thresholds
HIGH_VOLATILITY_THRESHOLD = 1.3  # Multiple of long-term volatility

# Classifier settings
PROBABILITY_SMOOTHING_WINDOW = 30  # Days for smoothing probabilities
LOGISTIC_REGRESSION_MAX_ITER = 500

# Monte Carlo settings
MC_DEFAULT_SIMULATIONS = 1000
MC_DEFAULT_HORIZON_DAYS = 20

# Regime names (for consistency)
REGIME_HIGH_VOLATILITY = "High Volatility"
REGIME_TRENDING = "Trending"
REGIME_RANGE_BOUND = "Range-Bound"
