import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';

/**
 * Dropdown Component
 * Animated selection menu with research-grade aesthetic
 */
export default function Dropdown({
    options,
    value,
    onChange,
    label
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.id === value);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            {label && <span className="text-label block mb-1.5">{label}</span>}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium",
                    "bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-md",
                    "hover:border-[var(--color-border-default)] transition-colors text-[var(--color-text-primary)]",
                    "min-w-[180px]"
                )}
            >
                <div className="flex items-center gap-2">
                    {/* Asset Icon / Type Badge if available (custom rendering logic could go here) */}
                    <span className="truncate">{selectedOption?.label || 'Select...'}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={clsx("text-[var(--color-text-muted)] transition-transform duration-200", isOpen && "rotate-180")}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 overflow-hidden origin-top-right bg-[var(--color-surface-overlay)] border border-[var(--color-border-subtle)] rounded-md shadow-xl backdrop-blur-sm"
                    >
                        <div className="py-1">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(
                                        "flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors",
                                        option.id === value
                                            ? "bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]"
                                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {option.label}
                                        {option.badge && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] rounded text-[var(--color-text-muted)]">
                                                {option.badge}
                                            </span>
                                        )}
                                    </span>
                                    {option.id === value && <Check size={14} className="text-[var(--color-accent-muted)]" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
