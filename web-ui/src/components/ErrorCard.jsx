import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff, Server, RefreshCw } from 'lucide-react';
import ButtonPrimary from './ButtonPrimary';

/**
 * ErrorCard Component
 * Categorized error display with retry functionality
 */
export default function ErrorCard({
    error,
    onRetry,
    title = 'Something went wrong',
    className
}) {
    // Categorize errors
    const getErrorInfo = (error) => {
        const message = error?.message || error || 'An unexpected error occurred';
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('network') || lowerMsg.includes('fetch') || lowerMsg.includes('failed to fetch')) {
            return {
                icon: WifiOff,
                category: 'Network Error',
                description: 'Unable to connect to the server. Please check your internet connection.',
                color: 'var(--color-regime-rangebound)'
            };
        }

        if (lowerMsg.includes('timeout') || lowerMsg.includes('timed out')) {
            return {
                icon: Server,
                category: 'Request Timeout',
                description: 'The server took too long to respond. Try again in a moment.',
                color: 'var(--color-regime-volatility)'
            };
        }

        if (lowerMsg.includes('500') || lowerMsg.includes('server')) {
            return {
                icon: Server,
                category: 'Server Error',
                description: 'The server encountered an error. Our team has been notified.',
                color: 'var(--color-regime-volatility)'
            };
        }

        return {
            icon: AlertTriangle,
            category: 'Error',
            description: message,
            color: 'var(--color-regime-volatility)'
        };
    };

    const errorInfo = getErrorInfo(error);
    const Icon = errorInfo.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card p-8 text-center ${className}`}
            style={{ borderColor: errorInfo.color }}
        >
            {/* Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${errorInfo.color}20` }}
            >
                <Icon
                    className="w-8 h-8"
                    style={{ color: errorInfo.color }}
                />
            </motion.div>

            {/* Title */}
            <h3 className="text-heading mb-2">{title}</h3>

            {/* Category Badge */}
            <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                style={{
                    backgroundColor: `${errorInfo.color}20`,
                    color: errorInfo.color
                }}
            >
                {errorInfo.category}
            </span>

            {/* Description */}
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-md mx-auto">
                {errorInfo.description}
            </p>

            {/* Retry Button */}
            {onRetry && (
                <ButtonPrimary
                    onClick={onRetry}
                    icon={RefreshCw}
                >
                    Try Again
                </ButtonPrimary>
            )}
        </motion.div>
    );
}
