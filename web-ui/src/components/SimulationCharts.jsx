import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * SimulationCharts Component
 * Displays Monte Carlo simulation distributions
 */
export default function SimulationCharts({ isRunning }) {
    // Mock simulation distribution data
    const distributionData = [
        { range: '-5%', count: 20 },
        { range: '-3%', count: 80 },
        { range: '-1%', count: 150 },
        { range: '0%', count: 300 },
        { range: '+1%', count: 250 },
        { range: '+3%', count: 120 },
        { range: '+5%', count: 40 },
    ];

    if (isRunning) {
        return (
            <div className="h-[300px] flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                <div className="w-full max-w-xs h-1 bg-[var(--color-surface-overlay)] rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[var(--color-accent-muted)] animate-loading-bar" />
                </div>
                <p className="text-sm animate-pulse">Running Monte Carlo Simulations...</p>
            </div>
        );
    }

    return (
        <div className="h-[300px]">
            <h4 className="text-label mb-4">Projected Return Distribution (20 Day)</h4>
            <ResponsiveContainer>
                <BarChart data={distributionData}>
                    <XAxis
                        dataKey="range"
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'var(--color-surface-overlay)' }}
                        contentStyle={{
                            backgroundColor: 'var(--color-surface-elevated)',
                            borderColor: 'var(--color-border-subtle)',
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{
                            color: 'var(--color-text-primary)',
                            fontWeight: 600,
                        }}
                        itemStyle={{
                            color: 'var(--color-text-secondary)',
                        }}
                    />
                    <Bar
                        dataKey="count"
                        fill="var(--color-accent-muted)"
                        radius={[4, 4, 0, 0]}
                        opacity={0.6}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
