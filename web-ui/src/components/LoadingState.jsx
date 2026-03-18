import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

/**
 * LoadingState Component
 * Animated loading with skeletons and contextual message
 */
export default function LoadingState({ message = 'Loading...', showSkeleton = true }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
        >
            {/* Animated Logo */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center mb-6"
            >
                <Activity className="w-6 h-6 text-white" />
            </motion.div>

            {/* Message */}
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[var(--color-text-muted)] text-sm mb-8"
            >
                {message}
            </motion.p>

            {/* Skeleton Cards */}
            {showSkeleton && (
                <div className="w-full max-w-2xl space-y-4">
                    <SkeletonCard />
                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonMetric />
                        <SkeletonMetric />
                    </div>
                </div>
            )}
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div className="card p-6">
            <div className="skeleton skeleton-heading w-1/3 mb-4" />
            <div className="skeleton skeleton-text w-full" />
            <div className="skeleton skeleton-text w-4/5" />
            <div className="skeleton skeleton-text w-2/3" />
        </div>
    );
}

function SkeletonMetric() {
    return (
        <div className="card p-4">
            <div className="skeleton skeleton-text w-1/2 mb-2" />
            <div className="skeleton skeleton-metric" />
        </div>
    );
}
