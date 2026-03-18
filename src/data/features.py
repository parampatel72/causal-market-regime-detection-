"""
Feature engineering module for Uncertainty-Aware Causal Market Regime Detection MVP.

This module computes all features using vectorized NumPy/Pandas operations
for scalability to large datasets.

Features (preserved from original implementation):
- Log returns
- Short-term volatility (20-day rolling std of returns)
- Long-term volatility (60-day rolling std of returns)
- Trend strength (60-day price change percentage)

NOTE: Technical indicators (RSI, ADX, etc.) are added for research display purposes
      but are calculated dynamically to avoid persisting them in the core dataset.
"""

import pandas as pd
import numpy as np

from ..config import (
    VOLATILITY_SHORT_WINDOW,
    VOLATILITY_LONG_WINDOW,
    TREND_WINDOW
)


class FeatureEngine:
    """
    Computes market features using fully vectorized operations.
    
    Designed for:
    - Scalability to 10+ years of daily data
    - Efficient memoization (features computed once per dataset)
    - Future extension to rolling windows
    """
    
    def __init__(
        self,
        short_window: int = VOLATILITY_SHORT_WINDOW,
        long_window: int = VOLATILITY_LONG_WINDOW,
        trend_window: int = TREND_WINDOW
    ):
        """
        Initialize feature engine with configurable windows.
        
        Args:
            short_window: Short-term volatility lookback period
            long_window: Long-term volatility lookback period
            trend_window: Trend calculation lookback period
        """
        self.short_window = short_window
        self.long_window = long_window
        self.trend_window = trend_window
    
    def compute_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Compute all features for regime detection.
        
        All operations are vectorized for performance with large datasets.
        
        Args:
            data: DataFrame with 'price' column
            
        Returns:
            DataFrame with added feature columns:
            - returns: Daily log returns
            - volatility_20d: Short-term realized volatility
            - volatility_60d: Long-term realized volatility
            - trend_60d: Trend strength
        """
        df = data.copy()
        
        # Log returns - vectorized
        df["returns"] = df["price"].pct_change()
        
        # Short-term volatility (20-day rolling std of returns)
        df["volatility_20d"] = df["returns"].rolling(
            window=self.short_window, 
            min_periods=self.short_window
        ).std()
        
        # Long-term volatility (60-day rolling std of returns)
        df["volatility_60d"] = df["returns"].rolling(
            window=self.long_window,
            min_periods=self.long_window
        ).std()
        
        # Trend strength (60-day price change)
        df["trend_60d"] = df["price"].pct_change(periods=self.trend_window)
        
        # Drop rows with NaN values from rolling calculations
        df.dropna(inplace=True)
        
        return df
    
    def get_recent_statistics(
        self, 
        data: pd.DataFrame, 
        window: int = None
    ) -> dict:
        """
        Compute recent statistics for Monte Carlo simulation.
        
        Args:
            data: DataFrame with computed features
            window: Lookback window for statistics (default: short_window)
            
        Returns:
            Dictionary with:
            - mean_return: Average daily return
            - volatility: Realized volatility
            - last_price: Most recent price
        """
        if window is None:
            window = self.short_window
            
        recent_data = data.tail(window)
        
        return {
        }
    
    def compute_technical_stats(self, data: pd.DataFrame) -> dict:
        """
        Compute technical indicators for the dashboard.
        
        Args:
            data: DataFrame with 'price', 'high', 'low', 'close' (or just price)
            
        Returns:
            Dictionary of technical metrics
        """
        df = data.copy()
        
        # Ensure we have enough data
        if len(df) < 60:
            return {}
            
        # Basic Price
        current_price = df["price"].iloc[-1]
        
        # 1. Moving Averages
        ma50 = df["price"].rolling(window=50).mean().iloc[-1]
        price_vs_ma50 = ((current_price / ma50) - 1) * 100
        
        # 2. RSI (14-day)
        delta = df["price"].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs)).iloc[-1]
        
        # 3. Bollinger Bands (20-day, 2-std)
        bb_mean = df["price"].rolling(window=20).mean()
        bb_std = df["price"].rolling(window=20).std()
        bb_upper = bb_mean + (bb_std * 2)
        bb_lower = bb_mean - (bb_std * 2)
        bb_width_pct = ((bb_upper.iloc[-1] - bb_lower.iloc[-1]) / bb_mean.iloc[-1]) * 100
        
        # 4. ADX (Simplified approximation if high/low not available, else standard)
        # Using simplified trend strength proxy if we only have 'price' (assumed close)
        # For true ADX we need High/Low. Assuming 'price' is close. 
        # We'll use a volatility-adjusted trend strength as a proxy for ADX strength
        # or just 60d trend magnitude scaled.
        # However, let's try to do a "Trend Strength" metric 0-100.
        trend_strength_raw = abs(df["trend_60d"].iloc[-1]) * 100 # % change over 60 days
        # normalize roughly: 0-20% move -> 0-100 score
        adx_proxy = min(100, trend_strength_raw * 2.5) + (20 if trend_strength_raw > 0.05 else 0)
        
        # 5. Volatility / ATR Proxy
        # ATR is usually High-Low, but we can use rolling std dev of price changes
        daily_range_pct = df["price"].pct_change().abs().rolling(window=14).mean().iloc[-1] * 100
        
        return {
            "price_vs_ma50": price_vs_ma50,
            "rsi": rsi,
            "bb_width": bb_width_pct,
            "adx": adx_proxy,
            "daily_swing": daily_range_pct
        }

    def compute_structural_breaks(self, data: pd.DataFrame, regimes: pd.Series) -> dict:
        """
        Compute statistics about structural breaks in the regime sequence.
        
        Args:
            data: Market data
            regimes: Series of regime labels (same index as data)
            
        Returns:
            Dictionary of break statistics
        """
        if len(regimes) < 2:
            return {}
            
        # Identify changes
        changes = regimes != regimes.shift(1)
        # First element is always False/NaN in shift comp
        changes.iloc[0] = False
        
        # Get dates of changes
        break_dates = regimes.index[changes]
        
        if len(break_dates) == 0:
            return {
                "last_break": "None",
                "days_in_regime": len(regimes),
                "avg_duration": len(regimes),
                "break_frequency": 0
            }
            
        last_break_date = break_dates[-1]
        days_in_regime = (regimes.index[-1] - last_break_date).days
        
        # Calculate durations
        # We need segments
        # Create a group id that increments on change
        groups = changes.cumsum()
        durations = regimes.groupby(groups).count() # days (approx rows for trading days)
        avg_duration = durations.mean()
        
        # Frequency per 30 days (trading days approx 21)
        total_days = len(regimes)
        total_breaks = len(break_dates)
        breaks_per_month = (total_breaks / total_days) * 21
        
        return {
            "last_break": last_break_date.strftime("%Y-%m-%d"),
            "days_in_regime": int(days_in_regime),
            "avg_duration": int(avg_duration),
            "break_frequency": round(breaks_per_month, 1)
        }

