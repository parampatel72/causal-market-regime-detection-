import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

/**
 * ButtonPrimary Component
 * Animated button with gradient, hover effects, and loading state
 */
export default function ButtonPrimary({
    children,
    onClick,
    loading = false,
    disabled = false,
    icon: Icon,
    className,
    variant = 'primary',
    size = 'md'
}) {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={clsx(
                variant === 'primary' ? 'btn-primary' : 'btn-secondary',
                sizeClasses[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4" />}
                    {children}
                </>
            )}
        </motion.button>
    );
}
