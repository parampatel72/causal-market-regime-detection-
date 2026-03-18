/**
 * Mock Data for Causal Market Regime Detection
 */

// Generate realistic history data for charts
function generateHistory(days = 180, seed = 0) {
    const data = [];
    const baseDate = new Date();

    const regimes = ['Trending', 'Range-Bound', 'High Volatility'];
    let currentRegimeIndex = seed % 3;
    let counter = 0;
    let regimeDuration = 25 + (seed * 7) % 20;

    for (let i = days; i >= 0; i--) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() - i);

        // Switch regimes periodically with some randomness
        if (counter > regimeDuration) {
            currentRegimeIndex = (currentRegimeIndex + 1 + Math.floor(Math.random() * 2)) % 3;
            counter = 0;
            regimeDuration = 20 + Math.floor(Math.random() * 25);
        }
        counter++;

        const currentRegime = regimes[currentRegimeIndex];
        const confidence = 0.55 + Math.random() * 0.4;

        // Calculate probabilities for each regime
        const otherProb = (1 - confidence) / 2;

        data.push({
            date: date.toISOString().split('T')[0],
            regime: currentRegime,
            confidence: confidence,
            Trending: currentRegime === 'Trending' ? confidence : otherProb,
            'Range-Bound': currentRegime === 'Range-Bound' ? confidence : otherProb,
            'High Volatility': currentRegime === 'High Volatility' ? confidence : otherProb,
        });
    }
    return data;
}

// Asset Configuration
export const ASSETS_CONFIG = [
    {
        id: 'sp500',
        label: 'S&P 500',
        ticker: '^GSPC',
        badge: 'US Equity',
        category: 'indices',
        icon: 'trending-up',
        description: 'US Large Cap Index'
    },
    {
        id: 'nifty',
        label: 'NIFTY 50',
        ticker: '^NSEI',
        badge: 'IN Equity',
        category: 'indices',
        icon: 'trending-up',
        description: 'India Large Cap Index'
    },
    {
        id: 'banknifty',
        label: 'Bank Nifty',
        ticker: '^NSEBANK',
        badge: 'IN Sector',
        category: 'indices',
        icon: 'landmark',
        description: 'India Banking Sector'
    },
    {
        id: 'btc',
        label: 'Bitcoin',
        ticker: 'BTC-USD',
        badge: 'Crypto',
        category: 'crypto',
        icon: 'bitcoin',
        description: 'Digital Gold'
    },
    {
        id: 'eth',
        label: 'Ethereum',
        ticker: 'ETH-USD',
        badge: 'Crypto',
        category: 'crypto',
        icon: 'cpu',
        description: 'Smart Contract Platform'
    },
    {
        id: 'sol',
        label: 'Solana',
        ticker: 'SOL-USD',
        badge: 'Crypto',
        category: 'crypto',
        icon: 'zap',
        description: 'High-Speed Blockchain'
    },
    {
        id: 'xrp',
        label: 'XRP',
        ticker: 'XRP-USD',
        badge: 'Crypto',
        category: 'crypto',
        icon: 'repeat',
        description: 'Payment Network'
    },
    {
        id: 'xaud',
        label: 'Gold (XAU/USD)',
        ticker: 'GC=F',
        badge: 'Commodity',
        category: 'commodities',
        icon: 'circle',
        description: 'Precious Metal'
    },
    {
        id: 'cl',
        label: 'Light Crude Oil',
        ticker: 'CL=F',
        badge: 'Commodity',
        category: 'commodities',
        icon: 'droplet',
        description: 'Energy Market'
    },
    {
        id: 'us30',
        label: 'US 30',
        ticker: '^DJI',
        badge: 'US Equity',
        category: 'indices',
        icon: 'trending-up',
        description: 'Dow Jones Industrial Average'
    },
];

// Historical data cache
export const MOCK_HISTORY = {
    'sp500': generateHistory(180, 1),
    'nifty': generateHistory(180, 2),
    'banknifty': generateHistory(180, 3),
    'btc': generateHistory(180, 4),
    'eth': generateHistory(180, 5),
    'sol': generateHistory(180, 6),
    'xrp': generateHistory(180, 7),
    'xaud': generateHistory(180, 8),
    'cl': generateHistory(180, 9),
    'us30': generateHistory(180, 10),
};

// Current regime snapshot data
export const MOCK_REGIME_DATA = {
    'sp500': {
        currentRegime: 'Trending',
        confidence: 72.5,
        probabilities: { 'Trending': 0.725, 'Range-Bound': 0.185, 'High Volatility': 0.090 },
        stability: { stabilityScore: 68.0, transitionProbability: 32.0, horizonDays: 20, nSimulations: 10000 },
    },
    'nifty': {
        currentRegime: 'Range-Bound',
        confidence: 65.2,
        probabilities: { 'Trending': 0.20, 'Range-Bound': 0.652, 'High Volatility': 0.148 },
        stability: { stabilityScore: 78.0, transitionProbability: 22.0, horizonDays: 20, nSimulations: 10000 },
    },
    'banknifty': {
        currentRegime: 'Trending',
        confidence: 58.3,
        probabilities: { 'Trending': 0.583, 'Range-Bound': 0.297, 'High Volatility': 0.120 },
        stability: { stabilityScore: 52.0, transitionProbability: 48.0, horizonDays: 20, nSimulations: 10000 },
    },
    'btc': {
        currentRegime: 'High Volatility',
        confidence: 88.5,
        probabilities: { 'Trending': 0.05, 'Range-Bound': 0.065, 'High Volatility': 0.885 },
        stability: { stabilityScore: 45.0, transitionProbability: 55.0, horizonDays: 20, nSimulations: 10000 },
    },
    'eth': {
        currentRegime: 'High Volatility',
        confidence: 76.2,
        probabilities: { 'Trending': 0.12, 'Range-Bound': 0.118, 'High Volatility': 0.762 },
        stability: { stabilityScore: 48.0, transitionProbability: 52.0, horizonDays: 20, nSimulations: 10000 },
    },
    'sol': {
        currentRegime: 'Trending',
        confidence: 69.8,
        probabilities: { 'Trending': 0.698, 'Range-Bound': 0.152, 'High Volatility': 0.150 },
        stability: { stabilityScore: 55.0, transitionProbability: 45.0, horizonDays: 20, nSimulations: 10000 },
    },
    'xrp': {
        currentRegime: 'Range-Bound',
        confidence: 61.4,
        probabilities: { 'Trending': 0.186, 'Range-Bound': 0.614, 'High Volatility': 0.200 },
        stability: { stabilityScore: 62.0, transitionProbability: 38.0, horizonDays: 20, nSimulations: 10000 },
    },
    'xaud': {
        currentRegime: 'Trending',
        confidence: 75.3,
        probabilities: { 'Trending': 0.753, 'Range-Bound': 0.147, 'High Volatility': 0.100 },
        stability: { stabilityScore: 68.5, transitionProbability: 31.5, horizonDays: 20, nSimulations: 10000 },
    },
    'cl': {
        currentRegime: 'High Volatility',
        confidence: 82.1,
        probabilities: { 'Trending': 0.100, 'Range-Bound': 0.079, 'High Volatility': 0.821 },
        stability: { stabilityScore: 50.0, transitionProbability: 50.0, horizonDays: 20, nSimulations: 10000 },
    },
    'us30': {
        currentRegime: 'Trending',
        confidence: 68.9,
        probabilities: { 'Trending': 0.689, 'Range-Bound': 0.211, 'High Volatility': 0.100 },
        stability: { stabilityScore: 70.0, transitionProbability: 30.0, horizonDays: 20, nSimulations: 10000 },
    },
};

// Transition Matrix Mock Data
export const MOCK_TRANSITION_MATRIX = {
    labels: ['Trending', 'Range-Bound', 'High Volatility'],
    matrix: [
        [0.75, 0.18, 0.07],  // From Trending
        [0.22, 0.65, 0.13],  // From Range-Bound
        [0.15, 0.25, 0.60],  // From High Volatility
    ],
};

// Regime configuration for styling
export const REGIME_CONFIG = {
    'Trending': {
        colorClass: 'badge-trending',
        color: 'var(--color-regime-trending)',
        bgColor: 'var(--color-regime-trending-bg)',
        description: 'Directional price movement with momentum',
        icon: 'trending-up',
    },
    'Range-Bound': {
        colorClass: 'badge-rangebound',
        color: 'var(--color-regime-rangebound)',
        bgColor: 'var(--color-regime-rangebound-bg)',
        description: 'Sideways consolidation within bounds',
        icon: 'minus',
    },
    'High Volatility': {
        colorClass: 'badge-volatility',
        color: 'var(--color-regime-volatility)',
        bgColor: 'var(--color-regime-volatility-bg)',
        description: 'Elevated uncertainty and price swings',
        icon: 'zap',
    },
};

// Methodology Sections
export const METHODOLOGY_SECTIONS = [
    {
        id: 'regimes',
        title: 'What is a Market Regime?',
        content: `A market regime is a distinct statistical state characterized by specific patterns in price behavior, volatility, and trend dynamics. Rather than viewing markets as a single continuous process, regime-based analysis recognizes that markets transition between fundamentally different behavioral states.

This approach is grounded in the observation that financial markets exhibit structural breaks and state-dependent dynamics. The three regimes identified—Trending, Range-Bound, and High Volatility—capture the primary modes of market behavior relevant to risk management and strategy selection.`,
    },
    {
        id: 'causal',
        title: 'Rule-Based Causal Logic',
        content: `This system employs transparent, rule-based logic for initial regime labeling rather than opaque machine learning. The causal approach means each regime classification can be traced back to specific, interpretable market conditions:

• **Trending**: Identified when ADX > 25 and price maintains position relative to moving averages
• **Range-Bound**: Detected when ADX < 20 and Bollinger Band width remains narrow
• **High Volatility**: Triggered when ATR percentile exceeds historical norms

This interpretability is crucial for research applications where understanding "why" matters as much as "what".`,
    },
    {
        id: 'probabilistic',
        title: 'Probabilistic Classification',
        content: `Rather than hard regime assignments, this system outputs probability distributions across all possible regimes. A logistic regression classifier, trained on rule-based labels, produces calibrated probability estimates.

The probabilistic output enables:
• **Uncertainty quantification**: Know when the model is confident vs uncertain
• **Gradient transitions**: Capture regime shifts as gradual probability changes
• **Risk-aware decisions**: Incorporate classification uncertainty into downstream analysis`,
    },
    {
        id: 'montecarlo',
        title: 'Monte Carlo Stability Analysis',
        content: `Monte Carlo simulation quantifies forward-looking regime uncertainty. By generating thousands of possible future price paths based on current statistical properties, the system estimates:

• **Stability Score**: Probability the current regime persists over the forecast horizon
• **Transition Probability**: Likelihood of regime change within N trading days
• **Regime Distribution**: Expected distribution of regimes across simulated paths

This forward-looking uncertainty quantification distinguishes this system from purely backward-looking regime detection methods.`,
    },
];
