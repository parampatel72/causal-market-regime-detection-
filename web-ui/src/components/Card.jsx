import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Card Component
 * Glassmorphism card with optional regime accent and hover effects
 */
export default function Card({
    children,
    header,
    className,
    regime,
    hoverable = true,
    glow = false
}) {
    const regimeClass = regime ? `card-${regime.toLowerCase().replace(/[\s-]+/g, '')}` : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
            className={clsx(
                'glass-card',
                regimeClass,
                glow && 'animate-pulse-glow',
                className
            )}
        >
            {header && (
                <div className="card-header border-b border-[rgba(56,189,248,0.1)] mb-6 pb-4">
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{header}</h3>
                </div>
            )}
            {children}
        </motion.div>
    );
}
