import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * ProgressBar Component
 * Animated progress bar with regime-specific colors
 */
export default function ProgressBar({
    value = 0,
    max = 100,
    regime,
    label,
    showValue = false,
    size = 'md',
    className
}) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const regimeClass = regime ? `progress-${regime.toLowerCase().replace(/[\s-]+/g, '')}` : '';

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className={clsx('w-full', className)}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && <span className="text-label">{label}</span>}
                    {showValue && (
                        <span className="text-caption font-medium">
                            {percentage.toFixed(1)}%
                        </span>
                    )}
                </div>
            )}
            <div className={clsx('progress-bar', sizeClasses[size], regimeClass)}>
                <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        background: !regime
                            ? 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary))'
                            : undefined
                    }}
                />
            </div>
        </div>
    );
}
