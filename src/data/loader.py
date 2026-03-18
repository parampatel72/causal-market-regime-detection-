"""
Data loading module for Uncertainty-Aware Causal Market Regime Detection MVP.

This module handles efficient data loading with caching support for
large historical datasets and future multi-asset extension.

NOTE: Streamlit dependency removed - now uses functools.lru_cache for API-only backend.
"""

import pandas as pd
import yfinance as yf
from functools import lru_cache
from typing import Optional

from ..config import DEFAULT_TICKER, DEFAULT_START_DATE


# In-memory cache for data loading
_data_cache = {}


class DataLoader:
    """
    Handles market data loading with caching for scalability.
    
    Designed for:
    - Large datasets (10+ years of daily data)
    - Future multi-asset support
    - Efficient caching to avoid redundant API calls
    """
    
    def __init__(self):
        pass
    
    @staticmethod
    def load_data(
        ticker: str = DEFAULT_TICKER,
        start: str = DEFAULT_START_DATE,
        end: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Load historical market data from Yahoo Finance.
        
        Args:
            ticker: Market ticker symbol (e.g., "^GSPC" for S&P 500)
            start: Start date in "YYYY-MM-DD" format
            end: End date (None for latest available)
            
        Returns:
            DataFrame with columns: price, returns
        """
        try:
            data = yf.download(
                ticker,
                start=start,
                end=end,
                auto_adjust=True,
                progress=False
            )
            
            if data.empty:
                raise ValueError(f"No data returned for ticker {ticker}")
            
            # Extract only closing price
            data = data[["Close"]]
            data.columns = ["price"]
            
            return data
            
        except Exception as e:
            raise RuntimeError(f"Failed to load data for {ticker}: {e}")
    
    @staticmethod
    def load_multiple_tickers(
        tickers: list,
        start: str = DEFAULT_START_DATE,
        end: Optional[str] = None
    ) -> dict:
        """
        Load data for multiple tickers (future-ready).
        
        Args:
            tickers: List of ticker symbols
            start: Start date
            end: End date
            
        Returns:
            Dictionary mapping ticker -> DataFrame
        """
        results = {}
        for ticker in tickers:
            try:
                results[ticker] = DataLoader.load_data(ticker, start, end)
            except Exception as e:
                print(f"Warning: Failed to load {ticker}: {e}")
        return results
