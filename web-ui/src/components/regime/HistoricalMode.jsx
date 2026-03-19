import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, TrendingUp, Minus, Zap } from 'lucide-react';
import ButtonPrimary from '../ButtonPrimary';
import ProgressBar from '../ProgressBar';
import RegimeChart from './RegimeChart';

/**
 * HistoricalMode
 * Left: controls panel. Right: results (stat cards + distribution + chart).
 */

const API_BASE = import.meta.env?.PROD ? '/api' : 'http://localhost:8000';

const ASSETS = {
    'S&P 500':   '^GSPC',
    'NIFTY 50':  '^NSEI',
    'GOLD':      'GC=F',
    'Bitcoin':   'BTC-USD',
    'BANKNIFTY': '^NSEBANK',
    'Crude Oil': 'CL=F',
    'Ethereum':  'ETH-USD',
    'Solana':    'SOL-USD',
    'XRP':       'XRP-USD',
    'US30':      '^DJI',
};

const REGIME_META = {
    'Trending':       { color: '#5B5DFF', bg: 'rgba(91,93,255,0.12)',  icon: TrendingUp },
    'Range-Bound':    { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: Minus      },
    'High Volatility':{ color: '#F43F5E', bg: 'rgba(244,63,94,0.12)',  icon: Zap        },
};

function StatCard({ label, value, children }) {
    return (
        <div className="glass-card p-4 flex flex-col gap-1.5">
            <p className="text-label text-xs">{label}</p>
            {children || <p className="text-xl font-bold text-[var(--color-text-primary)]">{value}</p>}
        </div>
    );
}

function RegimeBadgeInline({ regime }) {
    const meta = REGIME_META[regime] || {};
    return (
        <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
            style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44` }}
        >
            {regime}
        </span>
    );
}

export default function HistoricalMode({ onResultChange }) {
    const [selectedAsset, setSelectedAsset] = useState('S&P 500');
    const [customTicker, setCustomTicker]   = useState('');
    const [startDate, setStartDate]         = useState('2015-01-01');
    const [endDate, setEndDate]             = useState('');
    const [loading, setLoading]             = useState(false);
    const [result, setResult]               = useState(null);
    const [error, setError]                 = useState('');

    async function handleRun() {
        setLoading(true);
        setError('');
        setResult(null);

        const ticker = customTicker.trim() || ASSETS[selectedAsset];
        const name   = customTicker.trim() ? customTicker.trim() : selectedAsset;

        try {
            const res = await fetch(`${API_BASE}/api/regime/historical`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticker,
                    name,
                    start_date: startDate,
                    end_date: endDate || null,
                }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.error || 'Unknown error from backend.');
            } else {
                setResult(data);
                onResultChange?.(data);   // bubble up for comparison panel
            }
        } catch (e) {
            setError('Cannot reach backend. Is the API server running?');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            {/* ── Controls ── */}
            <div className="glass-card flex flex-col gap-5">
                <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--color-accent-primary)]" />
                    Backtest Settings
                </h3>

                {/* Asset dropdown */}
                <div>
                    <label className="text-label text-xs block mb-1.5">Asset</label>
                    <select
                        className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]"
                        value={selectedAsset}
                        onChange={(e) => { setSelectedAsset(e.target.value); setCustomTicker(''); }}
                    >
                        {Object.keys(ASSETS).map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                {/* Custom ticker */}
                <div>
                    <label className="text-label text-xs block mb-1.5">Custom Ticker (overrides above)</label>
                    <input
                        type="text"
                        placeholder="e.g. AAPL, TSLA"
                        value={customTicker}
                        onChange={(e) => setCustomTicker(e.target.value)}
                        className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)] placeholder-[var(--color-text-muted)]"
                    />
                </div>

                {/* Date pickers */}
                <div>
                    <label className="text-label text-xs block mb-1.5">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]"
                    />
                </div>
                <div>
                    <label className="text-label text-xs block mb-1.5">End Date <span className="text-[var(--color-text-muted)] font-normal normal-case">(leave blank = today)</span></label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]"
                    />
                </div>

                <ButtonPrimary onClick={handleRun} loading={loading} icon={Play} size="md">
                    Run Backtest
                </ButtonPrimary>

                {error && (
                    <div className="info-block info-block-danger text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* ── Results ── */}
            <div className="flex flex-col gap-6">
                {!result && !loading && (
                    <div className="glass-card flex items-center justify-center min-h-[300px] text-[var(--color-text-muted)]">
                        Configure settings and click Run Backtest
                    </div>
                )}

                {loading && (
                    <div className="glass-card flex items-center justify-center min-h-[300px] gap-3 text-[var(--color-text-muted)]">
                        <span className="w-5 h-5 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
                        Downloading market data &amp; computing regimes…
                    </div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-5"
                    >
                        {/* Row 1: Stat cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard label="TOTAL DAYS" value={result.total_days?.toLocaleString()} />
                            <StatCard label="CURRENT REGIME">
                                <RegimeBadgeInline regime={result.current_regime} />
                            </StatCard>
                            <StatCard label="DATE RANGE" value={`${result.start_date} → ${result.end_date}`} />
                        </div>

                        {/* Row 2: Distribution */}
                        <div className="glass-card">
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Regime Distribution</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {Object.entries(result.distribution || {}).map(([regime, info]) => {
                                    const meta = REGIME_META[regime] || {};
                                    const Icon = meta.icon || Minus;
                                    return (
                                        <div key={regime} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: meta.color }}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {regime}
                                                </span>
                                                <span className="text-[var(--color-text-muted)] text-xs">{info.count?.toLocaleString()} days</span>
                                            </div>
                                            <ProgressBar
                                                value={info.percentage}
                                                max={100}
                                                regime={regime === 'High Volatility' ? 'volatility' : regime === 'Trending' ? 'trending' : 'rangebound'}
                                                showValue
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Row 3: Chart */}
                        <div className="glass-card">
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">
                                Price History with Regime Bands
                                <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">
                                    {result.name} · {result.ticker}
                                </span>
                            </h4>
                            <RegimeChart chartData={result.chart_data} height={300} />

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 mt-3">
                                {Object.entries(REGIME_META).map(([r, m]) => (
                                    <span key={r} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                                        <span className="w-3 h-3 rounded-sm inline-block" style={{ background: m.bg, border: `1px solid ${m.color}` }} />
                                        {r}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
