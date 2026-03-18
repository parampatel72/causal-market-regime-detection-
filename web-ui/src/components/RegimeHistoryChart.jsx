import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Direct color values since CSS variables can't be used in SVG gradients easily
const REGIME_COLORS = {
    'Trending': '#38bdf8',
    'Range-Bound': '#fbbf24',
    'High Volatility': '#f472b6',
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const dominant = payload.reduce((prev, current) =>
            prev.value > current.value ? prev : current
        );

        return (
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-[var(--color-text-muted)] text-xs mb-1">{label}</p>
                <p className="font-semibold text-sm text-[var(--color-text-primary)] mb-2">
                    {dominant.name}: {(dominant.value * 100).toFixed(1)}%
                </p>
                <div className="flex flex-col gap-1">
                    {payload.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2 text-xs">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-[var(--color-text-muted)]">{entry.name}</span>
                            <span className="text-[var(--color-text-secondary)] ml-auto">
                                {(entry.value * 100).toFixed(0)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function RegimeHistoryChart({ data, height = 300 }) {
    if (!data || data.length === 0) {
        return (
            <div
                className="flex items-center justify-center text-[var(--color-text-muted)]"
                style={{ height }}
            >
                No historical data available
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorTrending" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={REGIME_COLORS['Trending']} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={REGIME_COLORS['Trending']} stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={REGIME_COLORS['Range-Bound']} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={REGIME_COLORS['Range-Bound']} stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={REGIME_COLORS['High Volatility']} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={REGIME_COLORS['High Volatility']} stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(45, 58, 79, 0.5)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={40}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }}
                    />
                    <YAxis
                        hide
                        domain={[0, 1]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="Trending"
                        stackId="1"
                        stroke={REGIME_COLORS['Trending']}
                        strokeWidth={2}
                        fill="url(#colorTrending)"
                    />
                    <Area
                        type="monotone"
                        dataKey="Range-Bound"
                        stackId="1"
                        stroke={REGIME_COLORS['Range-Bound']}
                        strokeWidth={2}
                        fill="url(#colorRange)"
                    />
                    <Area
                        type="monotone"
                        dataKey="High Volatility"
                        stackId="1"
                        stroke={REGIME_COLORS['High Volatility']}
                        strokeWidth={2}
                        fill="url(#colorVol)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
