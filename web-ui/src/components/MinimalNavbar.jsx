import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import clsx from 'clsx';
import SpotlightCard from './SpotlightCard';

/**
 * MinimalNavbar Component
 * Transparent, minimal navigation for homepage only
 * Shows: Logo + Home | Methodology | About
 */

const navItems = [
    { path: '/', label: 'Home' },
    { path: '/methodology', label: 'Methodology' },
    { path: '/about', label: 'About' },
];

export default function MinimalNavbar() {
    const location = useLocation();

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-0 left-0 right-0 z-50"
        >
            <div className="container-main">
                <div className="flex items-center justify-between h-28">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center shadow-xl shadow-[var(--color-accent-primary)]/30">
                            <Activity className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text-primary)] hidden sm:block">
                            Causal Market Regime Detector
                        </span>
                    </div>

                    {/* Minimal Nav Links - Larger and more visible */}
                    <div className="flex items-center gap-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <SpotlightCard
                                    key={item.path}
                                    className="rounded-xl overflow-hidden"
                                    spotlightColor="rgba(255, 255, 255, 0.15)"
                                >
                                    <NavLink
                                        to={item.path}
                                        className={clsx(
                                            'block px-8 py-4 text-xl font-semibold transition-all duration-300 w-full h-full relative z-10',
                                            isActive
                                                ? 'text-white bg-white/20 backdrop-blur-md border border-white/20 shadow-lg'
                                                : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                                        )}
                                    >
                                        {item.label}
                                    </NavLink>
                                </SpotlightCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
