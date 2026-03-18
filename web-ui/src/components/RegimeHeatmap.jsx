import { motion } from 'framer-motion';

/**
 * RegimeHeatmap Component
 * Visualizes transition probabilities between regimes
 */
export default function RegimeHeatmap() {
    const regimes = ['Trending', 'Range-Bound', 'High Volatility'];
    // Mock transition matrix (row to column)
    const matrix = [
        [0.75, 0.20, 0.05], // From Trending
        [0.15, 0.70, 0.15], // From Range-Bound
        [0.10, 0.25, 0.65], // From High Volatility
    ];

    const getColor = (value) => {
        // Opacity based on probability
        return `rgba(90, 122, 184, ${value})`;
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[400px]">
                {/* Header */}
                <div className="flex mb-2">
                    <div className="w-24 shrink-0"></div>
                    {regimes.map((r) => (
                        <div key={r} className="flex-1 text-center text-[10px] uppercase font-medium text-[var(--color-text-muted)]">
                            To {r}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {regimes.map((from, i) => (
                    <div key={from} className="flex items-center mb-2">
                        <div className="w-24 shrink-0 text-xs font-medium text-[var(--color-text-secondary)]">
                            {from}
                        </div>
                        {matrix[i].map((val, j) => (
                            <motion.div
                                key={`${from}-${j}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 + j * 0.1 }}
                                className="flex-1 h-12 mx-1 rounded flex items-center justify-center border border-[var(--color-border-subtle)]"
                                style={{ backgroundColor: getColor(val) }}
                            >
                                <span className="text-xs font-semibold text-white drop-shadow-md">
                                    {(val * 100).toFixed(0)}%
                                </span>
                            </motion.div>
                        ))}
                    </div>
                ))}

                <p className="text-center text-caption mt-2">
                    Transition Probability Matrix (Historical 6M)
                </p>
            </div>
        </div>
    );
}
