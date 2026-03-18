"""
Probabilistic regime classifier for market regime detection.

This module implements a Logistic Regression classifier that generalizes
and smooths the causal rule-based regime definitions.

IMPORTANT: ML is used to generalize rule-based labels, NOT to predict prices.
The classifier learns patterns from interpretable features to provide stable
probability outputs for regime classification.

No deep learning or black-box models are used - only interpretable
Logistic Regression as specified in the MVP requirements.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from typing import Optional, Tuple

from ..config import (
    PROBABILITY_SMOOTHING_WINDOW,
    LOGISTIC_REGRESSION_MAX_ITER
)


class RegimeClassifier:
    """
    Probabilistic regime classifier using Logistic Regression.
    
    This classifier provides:
    - Soft probability outputs for regime probabilities
    - Smoothed probabilities to reduce noise
    - Time-based train/test split to prevent data leakage
    - Optional rolling retraining for adaptive classification
    
    NOTE: The classifier learns from rule-based labels (interpretable rules)
    to provide stable probability estimates. It does NOT predict prices.
    """
    
    # Features used for classification (preserved from original)
    FEATURES = ["volatility_20d", "volatility_60d", "trend_60d"]
    
    def __init__(
        self,
        smoothing_window: int = PROBABILITY_SMOOTHING_WINDOW,
        max_iter: int = LOGISTIC_REGRESSION_MAX_ITER
    ):
        """
        Initialize the regime classifier.
        
        Args:
            smoothing_window: Window for probability smoothing (days)
            max_iter: Maximum iterations for Logistic Regression
        """
        self.smoothing_window = smoothing_window
        self.max_iter = max_iter
        self.scaler = StandardScaler()
        self.model = LogisticRegression(max_iter=max_iter)
        self._is_fitted = False
    
    def fit(
        self, 
        data: pd.DataFrame,
        test_size: float = 0.3
    ) -> Tuple[float, pd.DataFrame]:
        """
        Fit the classifier using time-based split.
        
        Uses time-ordered split (not random) to prevent data leakage.
        The classifier learns from rule-based regime labels.
        
        Args:
            data: DataFrame with features and 'rule_regime' column
            test_size: Fraction of data for testing (from end of series)
            
        Returns:
            Tuple of (accuracy_score, test_predictions_df)
        """
        X = data[self.FEATURES]
        y = data["rule_regime"]
        
        # Time-based split - NO shuffling to prevent leakage
        split_idx = int(len(X) * (1 - test_size))
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Fit model
        self.model.fit(X_train_scaled, y_train)
        self._is_fitted = True
        
        # Evaluate
        accuracy = self.model.score(X_test_scaled, y_test)
        
        # Get predictions for test set
        test_df = pd.DataFrame(index=X_test.index)
        test_df["actual"] = y_test
        test_df["predicted"] = self.model.predict(X_test_scaled)
        
        return accuracy, test_df
    
    def fit_full(self, data: pd.DataFrame) -> None:
        """
        Fit classifier on entire dataset (for production use).
        
        Args:
            data: DataFrame with features and 'rule_regime' column
        """
        X = data[self.FEATURES]
        y = data["rule_regime"]
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self._is_fitted = True
    
    def predict_proba(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Get probability estimates for all regimes.
        
        Args:
            data: DataFrame with feature columns
            
        Returns:
            DataFrame with probability columns for each regime
        """
        if not self._is_fitted:
            raise ValueError("Classifier not fitted. Call fit() or fit_full() first.")
        
        X = data[self.FEATURES]
        X_scaled = self.scaler.transform(X)
        
        proba = self.model.predict_proba(X_scaled)
        proba_df = pd.DataFrame(
            proba,
            index=data.index,
            columns=self.model.classes_
        )
        
        return proba_df
    
    def predict_proba_smoothed(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Get smoothed probability estimates.
        
        Applies rolling mean to reduce day-to-day noise in probabilities.
        
        Args:
            data: DataFrame with feature columns
            
        Returns:
            DataFrame with smoothed probability columns
        """
        proba_df = self.predict_proba(data)
        
        # Apply rolling mean for smoothing
        smoothed = proba_df.rolling(
            window=self.smoothing_window,
            min_periods=1
        ).mean()
        
        return smoothed
    
    def get_current_regime(self, data: pd.DataFrame) -> Tuple[str, float]:
        """
        Get current dominant regime and confidence.
        
        Args:
            data: DataFrame with feature columns
            
        Returns:
            Tuple of (regime_name, confidence_percentage)
        """
        proba_smoothed = self.predict_proba_smoothed(data)
        
        # Get latest probabilities
        latest = proba_smoothed.iloc[-1]
        dominant_regime = latest.idxmax()
        confidence = latest.max() * 100  # Convert to percentage
        
        return dominant_regime, confidence
    
    def retrain_rolling(
        self,
        data: pd.DataFrame,
        window_size: int = 252  # 1 year of trading days
    ) -> None:
        """
        Retrain on most recent window (rolling retraining support).
        
        This method supports adaptive retraining on recent data
        for evolving market conditions.
        
        Args:
            data: Full DataFrame with features and labels
            window_size: Number of recent observations to use
        """
        recent_data = data.tail(window_size)
        self.fit_full(recent_data)
    
    @property
    def classes_(self):
        """Get regime class names."""
        return self.model.classes_ if self._is_fitted else None
