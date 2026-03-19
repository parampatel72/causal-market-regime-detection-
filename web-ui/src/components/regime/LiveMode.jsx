import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Scan, TrendingUp, Minus, Zap } from 'lucide-react';
import ButtonPrimary from '../ButtonPrimary';
import RegimeCard from './RegimeCard';

/**
 * LiveMode
 * Asset selector tabs + single "Detect Now" or "Scan All" button.
 * Shows one RegimeCard or a grid of 6 sorted cards.
 */

const API_BASE = import.meta.env?.PROD ? '' : 'http://localhost:8000';

const ASSETS = [
    { name: 'S&P 500',   ticker: '^GSPC'   },
    { name: 'NIFTY 50',  ticker: '^NSEI'   },
    { name: 'GOLD',      ticker: 'GC=F'    },
    { name: 'Bitcoin',   ticker: 'BTC-USD' },
    { name: 'BANKNIFTY', ticker: '^NSEBANK'},
    { name: 'Crude Oil', ticker: 'CL=F'    },
    { name: 'Ethereum',  ticker: 'ETH-USD' },
    { name: 'Solana',    ticker: 'SOL-USD' },
    { name: 'XRP',       ticker: 'XRP-USD' },
    { name: 'US30',      ticker: '^DJI'    },
];

const REGIME_SORT_ORDER = ['Trending', 'Range-Bound', 'High Volatility'];

function sortByRegime(results) {
    return [...results].sort((a, b) => {
        const ai = REGIME_SORT_ORDER.indexOf(a.regime) ?? 99;
        const bi = REGIME_SORT_ORDER.indexOf(b.regime) ?? 99;
        return ai - bi;
    });
}

function SkeletonCard() {
    return (
        <div className="glass-card animate-shimmer min-h-[180px]">
            <div className="skeleton skeleton-heading mb-3" />
            <div className="skeleton skeleton-text mb-2" />
            <div className="skeleton skeleton-metric" />
        </div>
    );
}

export default function LiveMode({ onResultChange }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loadingSingle, setLoadingSingle] = useState(false);
    const [loadingAll,    setLoadingAll]    = useState(false);
    const [singleResult,  setSingleResult]  = useState(null);
    const [allResults,    setAllResults]    = useState(null);
    const [error,         setError]         = useState('');

    const selected = ASSETS[selectedIndex];

    async function detectSingle() {
        setLoadingSingle(true);
        setError('');
        setSingleResult(null);
        setAllResults(null);
        try {
            const res = await fetch(`${API_BASE}/api/regime/live`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: selected.ticker, name: selected.name }),
            });
            const data = await res.json();
            setSingleResult(data);
            onResultChange?.(data);
        } catch {
            setError('Cannot reach backend. Is the API server running?');
        } finally {
            setLoadingSingle(false);
        }
    }

    async function scanAll() {
        setLoadingAll(true);
        setError('');
        setSingleResult(null);
        setAllResults(null);
        try {
            const res = await fetch(`${API_BASE}/api/regime/live`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: 'all' }),
            });
            const data = await res.json();
            setAllResults(sortByRegime(data));
        } catch {
            setError('Cannot reach backend. Is the API server running?');
        } finally {
            setLoadingAll(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* ── Asset Selector + Actions ── */}
            <div className="glass-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[var(--color-accent-primary)]" />
                        Select Asset
                    </h3>
                    <div className="flex gap-3">
                        <ButtonPrimary onClick={detectSingle} loading={loadingSingle} size="sm">
                            Detect Now
                        </ButtonPrimary>
                        <ButtonPrimary onClick={scanAll} loading={loadingAll} icon={Scan} size="sm" variant="secondary">
                            Scan All
                        </ButtonPrimary>
                    </div>
                </div>

                {/* Asset radio tabs */}
                <div className="flex flex-wrap gap-2">
                    {ASSETS.map((asset, i) => (
                        <button
                            key={asset.ticker}
                            onClick={() => { setSelectedIndex(i); setSingleResult(null); setAllResults(null); }}
                            className={`
                                px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                                ${selectedIndex === i
                                    ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                                    : 'bg-[var(--color-surface-overlay)] border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)]'
                                }
                            `}
                        >
                            {asset.name}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="info-block info-block-danger text-sm mt-4">
                        {error}
                    </div>
                )}
            </div>

            {/* ── Loading skeleton for Scan All ── */}
            {loadingAll && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* ── Single result ── */}
            <AnimatePresence mode="wait">
                {singleResult && !loadingSingle && (
                    <motion.div
                        key="single"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="max-w-sm"
                    >
                        <RegimeCard data={singleResult} />
                    </motion.div>
                )}

                {/* ── All results grid ── */}
                {allResults && !loadingAll && (
                    <motion.div
                        key="all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-label text-xs mb-3">
                            {allResults.length} assets scanned — sorted by regime
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allResults.map((r) => (
                                <RegimeCard key={r.ticker} data={r} compact />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
