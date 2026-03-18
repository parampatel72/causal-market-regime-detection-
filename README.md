# Causal Market Regime Detection

<div align="center">
  <h3>Uncertainty-Aware Market Regime Detection with Monte Carlo Stability Analysis</h3>
</div>

## 📖 Overview

**Causal Market Regime Detection** is a full-stack platform that identifies underlying market conditions (regimes) across multiple asset classes including Equities (US & Indian markets) and Cryptocurrencies. Unlike traditional black-box machine learning models, this project uses **causal, rule-based economic logic** combined with **probabilistic classification** and **Monte Carlo simulations** to provide interpretable, forward-looking insights into market stability and risk.

## ✨ Key Features

- **Causal Rule-Based Regime Labeling:**
  Classifies the market into three core regimes based on robust, economically motivated rules:
  - 🔴 **High Volatility:** Triggered when short-term volatility significantly exceeds long-term volatility, signaling market stress or structural breaks.
  - 🟢 **Trending:** Positive sustained trends with stable volatility, indicating bullish momentum.
  - 🟡 **Range-Bound:** Market consolidation or sideways movement.

- **Probabilistic Regime Classification:**
  Outputs not just the current regime, but a smoothed probability distribution over all possible regimes, allowing for uncertainty-aware decision-making.

- **Monte Carlo Stability Analysis:**
  Simulates thousands of future price paths (extending out to 60 days) to compute:
  - Stability Scores
  - Transition Probabilities
  - Value at Risk (VaR 95% & VaR 99%)
  - Expected Returns and Volatility Profiles

- **Multiple Asset Classes Supported:**
  - **Indices:** S&P 500, NIFTY 50, Bank Nifty
  - **Crypto:** Bitcoin (BTC), Ethereum (ETH), Solana (SOL), XRP

- **Stunning UI/UX:**
  The frontend is built with React, Tailwind CSS, Framer Motion, and Three.js for interactive data visualization, providing a rich, dynamic, and responsive user experience.

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Data & Math:** Pandas, NumPy, Scikit-Learn
- **Architecture:** Modular pipeline (Data Loader -> Feature Engine -> Labeler -> Classifier -> Simulator)

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS V4
- **Animations & 3D:** Framer Motion, GSAP, React Three Fiber / Drei
- **Charts:** Recharts

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/causal-market-regime-detection.git
cd causal-market-regime-detection

# Create a virtual environment and step into it
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```
*The API will be available at `http://localhost:8000/docs`.*

### 2. Frontend Setup

```bash
# Open a new terminal instance and navigate to the UI folder
cd web-ui

# Install Node dependencies
npm install

# Start the development server
npm run dev
```
*The Web App will be available at `http://localhost:5173`.*

## 🧠 Methodology

1. **Feature Engineering:** Extracts rolling metrics (20-day, 60-day volatility), structural breaks, and momentum indicators from raw price data.
2. **Rule Labeling:** Applies the `RuleBasedLabeler` to generate domain-expert market state labels.
3. **Probabilistic Modeling:** Trains a classifier (e.g., Logistic Regression or Random Forest) over the rule-based ground-truths to handle noisy, borderline observations and yield smooth state probabilities.
4. **Monte Carlo Engine:** Uses parameterized returns and volatility specific to the *identified regime* to run bounded random walks, projecting risk metrics (VaR) into the future.

## 📄 License

This project is licensed under the MIT License.
