import { motion } from 'framer-motion';
import { TrendingUp, Minus, Zap } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PageWrapper from '../components/PageWrapper';
import { useAppState } from '../hooks/useAppState';
import { ASSETS_CONFIG, MOCK_TRANSITION_MATRIX, MOCK_REGIME_DATA, REGIME_CONFIG } from '../data/mockData';

import CountUp from '../components/CountUp';

/**
 * TransitionMatrix Component
 * Heatmap visualization of regime transition probabilities
 */
function TransitionMatrix({ matrix, labels }) {
    const getColor = (value) => {
        // Blue-scale for probabilities
        return `rgba(56, 189, 248, ${value * 0.8 + 0.1})`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-base lg:text-lg table-fixed">
                <thead>
                    <tr>
                        <th className="p-3 text-left text-label w-1/4">From → To</th>
                        {labels.map(label => (
                            <th key={label} className="p-3 text-center text-label w-1/4">
                                {label.split(' ')[0]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row, i) => (
                        <tr key={i}>
                            <td className="p-3 text-body font-bold">{labels[i]}</td>
                            {row.map((value, j) => (
                                <td key={j} className="p-2">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (i * 3 + j) * 0.1, type: "spring" }}
                                        className="p-4 rounded-lg text-center font-bold tracking-wider shadow-sm"
                                        style={{
                                            backgroundColor: getColor(value),
                                            color: value > 0.4 ? '#ffffff' : 'var(--color-text-primary)',
                                            textShadow: value > 0.4 ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                                        }}
                                    >
                                        <CountUp value={value * 100} suffix="%" decimals={0} />
                                    </motion.div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * RegimeExplorer Page
 * Explore transition dynamics, structural breaks, and key drivers
 */
export default function RegimeExplorer() {
    const { selectedAssetId } = useAppState();
    const selectedAsset = ASSETS_CONFIG.find(a => a.id === selectedAssetId) || ASSETS_CONFIG[0];
    const regimeData = MOCK_REGIME_DATA[selectedAssetId] || MOCK_REGIME_DATA['sp500'];
    const currentRegime = regimeData.currentRegime;
    const regimeConfig = REGIME_CONFIG[currentRegime];

    // Key drivers based on regime
    const keyDrivers = {
        'Trending': [
            { metric: 'ADX', value: '32.5', signal: 'Strong trend strength', bullish: true },
            { metric: 'Price vs MA50', value: '+4.2%', signal: 'Above moving average', bullish: true },
            { metric: 'Momentum', value: 'Positive', signal: 'Sustained directional move', bullish: true },
        ],
        'Range-Bound': [
            { metric: 'ADX', value: '18.2', signal: 'Weak trend', bullish: false },
            { metric: 'BB Width', value: '2.1%', signal: 'Narrow bands', bullish: false },
            { metric: 'RSI', value: '52', signal: 'Neutral momentum', bullish: false },
        ],
        'High Volatility': [
            { metric: 'ATR %ile', value: '92nd', signal: 'Elevated volatility', bullish: false },
            { metric: 'VIX Proxy', value: 'High', signal: 'Risk-off conditions', bullish: false },
            { metric: 'Price Swing', value: '±3.5%', signal: 'Large daily moves', bullish: false },
        ],
    };

    const drivers = keyDrivers[currentRegime] || keyDrivers['Trending'];

    // Structural break stats
    const breakStats = {
        lastBreak: '2024-12-15',
        daysInRegime: 28,
        avgDuration: 35,
        breakFrequency: '2.3 / month',
    };

    return (
        <PageWrapper>
            <main className="container-main py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-display mb-2">Regime Explorer</h1>
                        <p className="text-caption">
                            Analyze transition dynamics and regime characteristics for {selectedAsset.label}
                        </p>
                    </div>

                    <Badge variant={currentRegime.toLowerCase().replace(/[\s-]+/g, '')} pulse>
                        {currentRegime}
                    </Badge>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Transition Matrix */}
                    <Card header="Transition Probability Matrix" className="lg:col-span-2">
                        <p className="text-caption mb-4">
                            Probability of transitioning from one regime to another based on historical patterns
                        </p>
                        <TransitionMatrix
                            matrix={MOCK_TRANSITION_MATRIX.matrix}
                            labels={MOCK_TRANSITION_MATRIX.labels}
                        />
                        <div className="info-block mt-4">
                            <p className="text-sm">
                                Diagonal values show regime persistence probability. Higher off-diagonal values
                                indicate more frequent transitions between those states.
                            </p>
                        </div>
                    </Card>

                    {/* Key Drivers */}
                    <Card header="Key Regime Drivers">
                        <div className="space-y-3">
                            {drivers.map((driver, i) => (
                                <motion.div
                                    key={driver.metric}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-overlay)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-2 h-8 rounded-full"
                                            style={{ backgroundColor: regimeConfig?.color }}
                                        />
                                        <div>
                                            <span className="text-body font-medium">{driver.metric}</span>
                                            <p className="text-caption">{driver.signal}</p>
                                        </div>
                                    </div>
                                    <span
                                        className="text-heading font-mono"
                                        style={{ color: regimeConfig?.color }}
                                    >
                                        {driver.value}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>

                    {/* Structural Break Stats */}
                    <Card header="Structural Break Analysis">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)]">
                                <div className="metric-label mb-1">Last Break</div>
                                <div className="text-heading">{breakStats.lastBreak}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)]">
                                <div className="metric-label mb-1">Days in Regime</div>
                                <div className="text-heading">{breakStats.daysInRegime}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)]">
                                <div className="metric-label mb-1">Avg Duration</div>
                                <div className="text-heading">{breakStats.avgDuration} days</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)]">
                                <div className="metric-label mb-1">Break Frequency</div>
                                <div className="text-heading">{breakStats.breakFrequency}</div>
                            </div>
                        </div>

                        <div className="info-block mt-4">
                            <p className="text-sm">
                                The current <strong>{currentRegime}</strong> regime has persisted for {breakStats.daysInRegime} days,
                                which is {breakStats.daysInRegime < breakStats.avgDuration ? 'below' : 'above'} the
                                historical average of {breakStats.avgDuration} days.
                            </p>
                        </div>
                    </Card>

                    {/* Regime Persistence Insight */}
                    <Card header="Regime Persistence" className="lg:col-span-2" regime={currentRegime}>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: regimeConfig?.bgColor }}
                            >
                                {currentRegime === 'Trending' && <TrendingUp className="w-12 h-12" style={{ color: regimeConfig?.color }} />}
                                {currentRegime === 'Range-Bound' && <Minus className="w-12 h-12" style={{ color: regimeConfig?.color }} />}
                                {currentRegime === 'High Volatility' && <Zap className="w-12 h-12" style={{ color: regimeConfig?.color }} />}
                            </motion.div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-heading mb-2">
                                    {selectedAsset.label} Regime Outlook
                                </h3>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                    Based on transition matrix analysis, the current <Badge variant={currentRegime.toLowerCase().replace(/[\s-]+/g, '')}>{currentRegime}</Badge> regime
                                    has a <strong>{(MOCK_TRANSITION_MATRIX.matrix[MOCK_TRANSITION_MATRIX.labels.indexOf(currentRegime)]?.[MOCK_TRANSITION_MATRIX.labels.indexOf(currentRegime)] * 100 || 65).toFixed(0)}%</strong> probability
                                    of persisting into the next period. The most likely transition is
                                    to <strong>{
                                        currentRegime === 'Trending' ? 'Range-Bound' :
                                            currentRegime === 'Range-Bound' ? 'Trending' : 'Range-Bound'
                                    }</strong>.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </PageWrapper>
    );
}
