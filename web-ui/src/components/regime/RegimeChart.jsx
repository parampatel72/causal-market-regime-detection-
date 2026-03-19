import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
} from 'recharts';

/**
 * RegimeChart
 * Price line chart with regime-coloured background bands.
 * Uses Recharts ComposedChart matching the existing project style.
 */

const REGIME_COLORS = {
    'Trending':       'rgba(91, 93, 255, 0.12)',
    'Range-Bound':    'rgba(245, 158, 11, 0.12)',
    'High Volatility':'rgba(244, 63, 94, 0.12)',
};

const REGIME_STROKE = {
    'Trending':       '#5B5DFF',
    'Range-Bound':    '#F59E0B',
    'High Volatility':'#F43F5E',
};

function buildBands(chartData) {
    if (!chartData || chartData.length === 0) return [];
    const bands = [];
    let start = 0;
    let currentRegime = chartData[0].regime;

    for (let i = 1; i <= chartData.length; i++) {
        const regime = i < chartData.length ? chartData[i]?.regime : null;
        if (regime !== currentRegime) {
            bands.push({ x1: chartData[start].date, x2: chartData[i - 1].date, regime: currentRegime });
            start = i;
            currentRegime = regime;
        }
    }
    return bands;
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const d = payload[0]?.payload;
        const color = REGIME_STROKE[d?.regime] || '#B4B9C7';
        return (
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-[var(--color-text-muted)] text-xs mb-1">{label}</p>
                <p className="font-semibold text-[var(--color-text-primary)] text-sm">
                    {payload[0]?.value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <span
                    className="text-xs font-medium mt-1 inline-block"
                    style={{ color }}
                >
                    {d?.regime}
                </span>
            </div>
        );
    }
    return null;
};

export default function RegimeChart({ chartData, height = 320 }) {
    if (!chartData || chartData.length === 0) {
        return (
            <div
                className="flex items-center justify-center text-[var(--color-text-muted)]"
                style={{ height }}
            >
                No chart data available
            </div>
        );
    }

    const bands = buildBands(chartData);
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding  = (maxPrice - minPrice) * 0.05;

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(45, 58, 79, 0.5)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#7E8596', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={60}
                        tickFormatter={(v) => {
                            const d = new Date(v);
                            return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                        }}
                    />
                    <YAxis
                        domain={[minPrice - padding, maxPrice + padding]}
                        tick={{ fill: '#7E8596', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={70}
                        tickFormatter={(v) =>
                            v >= 1000
                                ? `${(v / 1000).toFixed(1)}k`
                                : v.toFixed(0)
                        }
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Regime background bands */}
                    {bands.map((band, i) => (
                        <ReferenceArea
                            key={i}
                            x1={band.x1}
                            x2={band.x2}
                            fill={REGIME_COLORS[band.regime] || 'transparent'}
                            strokeOpacity={0}
                        />
                    ))}

                    {/* Price line */}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#5B5DFF"
                        strokeWidth={1.5}
                        dot={false}
                        activeDot={{ r: 4, fill: '#5B5DFF' }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
