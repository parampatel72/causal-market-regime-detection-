import clsx from 'clsx';
import { TrendingUp, Minus, Zap, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * RegimeCard — compact card showing a single asset's live regime result.
 * Used in LiveMode for both single and "Scan All" views.
 */

const REGIME_STYLES = {
    'Trending': {
        badge: 'badge badge-trending',
        border: 'border-l-[var(--color-regime-trending)]',
        icon: TrendingUp,
        dot: '#5B5DFF',
    },
    'Range-Bound': {
        badge: 'badge badge-rangebound',
        border: 'border-l-[var(--color-regime-rangebound)]',
        icon: Minus,
        dot: '#F59E0B',
    },
    'High Volatility': {
        badge: 'badge badge-volatility',
        border: 'border-l-[var(--color-regime-volatility)]',
        icon: Zap,
        dot: '#F43F5E',
    },
};

const STABILITY_META = {
    Stable:       { icon: '✅', label: 'Stable' },
    Transitioning:{ icon: '⚠️', label: 'Transitioning' },
    Changing:     { icon: '🔄', label: 'Changing' },
};

function HistoryBadge({ regime }) {
    const style = REGIME_STYLES[regime] || REGIME_STYLES['Range-Bound'];
    return (
        <span
            className={clsx('inline-block w-2.5 h-2.5 rounded-full')}
            style={{ background: style.dot }}
            title={regime}
        />
    );
}

export default function RegimeCard({ data, compact = false }) {
    if (!data) return null;

    if (!data.success) {
        return (
            <div className="glass-card border-l-4 border-l-[var(--color-regime-volatility)]">
                <p className="text-label mb-1">{data.name || data.ticker}</p>
                <p className="text-[var(--color-regime-volatility)] text-sm">{data.error || 'Failed to fetch'}</p>
            </div>
        );
    }

    const style  = REGIME_STYLES[data.regime] || REGIME_STYLES['Range-Bound'];
    const RegIcon = style.icon;
    const stability = STABILITY_META[data.stability] || STABILITY_META['Changing'];

    return (
        <div className={clsx('glass-card border-l-4', `border-l-[${style.dot}]`, compact ? 'p-4' : '')}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-label text-xs">{data.ticker}</p>
                    <p className="font-semibold text-[var(--color-text-primary)] text-sm">{data.name}</p>
                </div>
                <span style={{ color: style.dot }}>
                    <RegIcon className="w-5 h-5" />
                </span>
            </div>

            {/* Price + date */}
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {data.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{data.date}</span>
            </div>

            {/* Regime badge */}
            <div className="mb-3">
                <span className={style.badge} style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem' }}>
                    <RegIcon className="w-3 h-3" />
                    {data.regime}
                </span>
            </div>

            {/* Confidence + Stability */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border-default)] text-[var(--color-text-secondary)]">
                    {data.confidence} confidence
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                    {stability.icon} {stability.label}
                </span>
            </div>

            {/* History dots */}
            {data.history && data.history.length > 0 && (
                <div>
                    <p className="text-label text-[0.65rem] mb-1.5">LAST 5 DAYS</p>
                    <div className="flex items-center gap-2">
                        {data.history.map((r, i) => (
                            <HistoryBadge key={i} regime={r} />
                        ))}
                        <span className="text-[0.6rem] text-[var(--color-text-muted)] ml-1">→ today</span>
                    </div>
                </div>
            )}
        </div>
    );
}
