"""
Causal rule-based regime labeling for market regime detection.

This module implements interpretable, economically-motivated rules for
labeling market regimes. The rules are preserved from the original
implementation to maintain consistency and interpretability.

IMPORTANT: These rules are designed for interpretability, NOT optimized
for prediction accuracy. Do NOT modify the rules to improve metrics.
Interpretability > Performance.
"""

import pandas as pd

from ..config import (
    HIGH_VOLATILITY_THRESHOLD,
    REGIME_HIGH_VOLATILITY,
    REGIME_TRENDING,
    REGIME_RANGE_BOUND
)


class RuleBasedLabeler:
    """
    Causal rule-based market regime labeler.
    
    This class applies economically-motivated rules to label market regimes
    based on observable market features. The rules encode domain knowledge
    about market behavior and serve as the "ground truth" for training
    the probabilistic classifier.
    
    Regime Definitions:
    -------------------
    1. High Volatility: Market stress or uncertainty
       - Condition: Short-term volatility > 1.3x Long-term volatility
       - Economic intuition: Sudden increase in volatility signals
         market stress, risk-off sentiment, or structural change.
    
    2. Trending: Directional momentum
       - Condition: Positive 60-day trend (and not High Volatility)
       - Economic intuition: Sustained price appreciation indicates
         bullish momentum and trend-following behavior.
    
    3. Range-Bound: Consolidation/indecision
       - Condition: Default when neither above condition is met
       - Economic intuition: Lack of clear direction suggests
         market consolidation or sideways movement.
    """
    
    def __init__(self, high_vol_threshold: float = HIGH_VOLATILITY_THRESHOLD):
        """
        Initialize the rule-based labeler.
        
        Args:
            high_vol_threshold: Multiplier for high volatility detection
                               (default: 1.3, meaning short vol > 1.3x long vol)
        """
        self.high_vol_threshold = high_vol_threshold
    
    def label_row(self, row: pd.Series) -> str:
        """
        Apply regime rules to a single observation.
        
        Args:
            row: Series with volatility_20d, volatility_60d, trend_60d
            
        Returns:
            Regime label string
        """
        # Rule 1: High Volatility - market stress/uncertainty
        # When short-term volatility significantly exceeds long-term,
        # it indicates a regime of heightened market stress.
        if row["volatility_20d"] > row["volatility_60d"] * self.high_vol_threshold:
            return REGIME_HIGH_VOLATILITY
        
        # Rule 2: Trending - directional momentum
        # Positive 60-day trend with stable volatility indicates
        # a trending market with bullish momentum.
        elif row["trend_60d"] > 0:
            return REGIME_TRENDING
        
        # Rule 3: Range-Bound - consolidation (default)
        # Neither high volatility nor positive trend suggests
        # market consolidation or sideways movement.
        else:
            return REGIME_RANGE_BOUND
    
    def label_dataframe(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Apply regime rules to entire DataFrame.
        
        Args:
            data: DataFrame with computed features
            
        Returns:
            DataFrame with added 'rule_regime' column
        """
        df = data.copy()
        df["rule_regime"] = df.apply(self.label_row, axis=1)
        return df
    
    def get_regime_distribution(self, data: pd.DataFrame) -> pd.Series:
        """
        Get distribution of regimes in the dataset.
        
        Args:
            data: DataFrame with 'rule_regime' column
            
        Returns:
            Series with regime counts
        """
        if "rule_regime" not in data.columns:
            data = self.label_dataframe(data)
        return data["rule_regime"].value_counts()
