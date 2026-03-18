import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * SegmentedControl Component
 * Sliding toggle for Asset/Timeframe selection
 */
export default function SegmentedControl({ options, value, onChange, size = 'md' }) {
    return (
        <div className="relative flex p-1 bg-[var(--color-surface-overlay)] rounded-lg border border-[var(--color-border-subtle)]">
            {options.map((option) => {
                const isSelected = value === option.id;

                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={clsx(
                            "relative z-10 flex-1 px-4 py-1.5 text-sm font-medium transition-colors duration-200 text-center rounded-md",
                            isSelected ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                            size === 'sm' && "text-xs px-3 py-1"
                        )}
                    >
                        {isSelected && (
                            <motion.div
                                className="absolute inset-0 bg-[var(--color-surface-subtle)] rounded-md border border-[var(--color-border-subtle)] shadow-sm"
                                layoutId={`segmented-bg-${options[0].id}`}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-20">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
