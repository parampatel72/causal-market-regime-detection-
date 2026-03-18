import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

/**
 * BackgroundLayout
 * Wrapper ensures AnimatedBackground persists across route changes.
 * Only the content inside Outlet animates.
 */
export default function BackgroundLayout() {
    const location = useLocation();

    return (
        <div className="relative min-h-screen text-[var(--color-text-primary)]">
            <AnimatedBackground />

            <div className="relative z-10">
                <Navbar />

                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
