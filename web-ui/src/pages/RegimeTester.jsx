import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, History, Radio, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import SegmentedControl from '../components/SegmentedControl';
import HistoricalMode from '../components/regime/HistoricalMode';
import LiveMode from '../components/regime/LiveMode';

/**
 * RegimeTester Page
 * ─────────────────
 * Standalone page at /regime-tester.
 * Two modes: Historical Backtest | Live Detection.
 * Optional Comparison Panel when both modes have been run on the same asset.
 */

const MODES = [
    { id: 'historical', label: '📊 Historical Backtest' },
    { id: 'live',       label: '⚡ Live Detection'      },
];

function ComparisonPanel({ historicalResult, liveResult }) {
    // Only show when both results are for the same ticker
    if (!historicalResult || !liveResult) return null;
    if (!liveResult.success) return null;
    if (historicalResult.ticker !== liveResult.ticker) return null;

    const liveRegime  = liveResult.regime;
    const dist        = historicalResult.distribution?.[liveRegime];
    const pct         = dist?.percentage ?? 0;

    let icon, label, colorClass;
    if (pct < 20) {
        icon = <AlertTriangle className="w-5 h-5" />;
        label = 'Rare regime — trade with extra caution';
        colorClass = 'text-[var(--color-regime-volatility)]';
    } else if (pct <= 50) {
        icon = <span className="text-lg">🟡</span>;
        label = 'Moderate frequency regime';
        colorClass = 'text-[var(--color-regime-rangebound)]';
    } else {
        icon = <CheckCircle className="w-5 h-5" />;
        label = 'Dominant regime — high confidence';
        colorClass = 'text-[var(--color-regime-trending)]';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mt-6 border-t-2 border-t-[var(--color-accent-primary)]"
        >
            <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-[var(--color-accent-primary)]" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">Historical Comparison</h3>
                <span className="badge text-xs ml-auto">{historicalResult.ticker}</span>
            </div>

            <div className={`flex items-center gap-3 ${colorClass}`}>
                {icon}
                <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                        Current regime is <span className={colorClass}>{liveRegime}</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Historically this regime occurred{' '}
                        <span className="font-bold text-[var(--color-text-primary)]">{pct}%</span>
                        {' '}of the time ({dist?.count?.toLocaleString()} days)
                    </p>
                    <p className={`text-sm font-medium mt-0.5 ${colorClass}`}>{label}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default function RegimeTester() {
    const [activeMode,       setActiveMode]       = useState('historical');
    const [historicalResult, setHistoricalResult] = useState(null);
    const [liveResult,       setLiveResult]       = useState(null);

    return (
        <div className="container-main py-8">
            {/* ── Page Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--gradient-primary)' }}
                    >
                        <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-heading text-[var(--color-text-primary)]">Regime Tester</h1>
                        <p className="text-caption text-[var(--color-text-muted)]">
                            Historical backtest &amp; live market regime detection
                        </p>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="mt-6 max-w-xs">
                    <SegmentedControl
                        options={MODES}
                        value={activeMode}
                        onChange={setActiveMode}
                    />
                </div>
            </div>

            {/* ── Mode Content ── */}
            <AnimatePresence mode="wait">
                {activeMode === 'historical' && (
                    <motion.div
                        key="historical"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <HistoricalMode onResultChange={setHistoricalResult} />
                    </motion.div>
                )}

                {activeMode === 'live' && (
                    <motion.div
                        key="live"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <LiveMode onResultChange={setLiveResult} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Comparison Panel (cross-mode) ── */}
            <ComparisonPanel
                historicalResult={historicalResult}
                liveResult={liveResult}
            />
        </div>
    );
}
