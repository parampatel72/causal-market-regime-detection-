import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    LayoutDashboard,
    Layers,
    GitBranch,
    PlayCircle,
    BookOpen,
    Info,
    Activity
} from 'lucide-react';
import clsx from 'clsx';
import SpotlightCard from './SpotlightCard';

const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assets', label: 'Assets', icon: Layers },
    { path: '/explorer', label: 'Regime Explorer', icon: GitBranch },
    { path: '/simulations', label: 'Simulations', icon: PlayCircle },
    { path: '/methodology', label: 'Methodology', icon: BookOpen },
    { path: '/about', label: 'About', icon: Info },
];

/**
 * Navbar Component
 * Premium glassmorphism navigation matching homepage design
 */
export default function Navbar() {
    const location = useLocation();

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-50 mb-12"
            style={{
                background: 'rgba(11, 14, 20, 0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--color-border-subtle)',
            }}
        >
            <div className="container-main">
                <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
                    {/* Logo - Compact & Responsive */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div
                            className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                            style={{
                                background: 'var(--gradient-primary)',
                                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="text-sm md:text-base font-bold text-white whitespace-nowrap">
                                Causal Market Regime Detector
                            </h1>
                            <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
                                Research Platform
                            </p>
                        </div>
                    </div>

                    {/* Nav Links - Centered & Responsive */}
                    <div className="flex items-center gap-1 px-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <SpotlightCard
                                    key={item.path}
                                    className="rounded-lg overflow-hidden"
                                    spotlightColor="rgba(255, 255, 255, 0.15)"
                                >
                                    <NavLink
                                        to={item.path}
                                        className={clsx(
                                            'flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm lg:text-base font-medium transition-all duration-200 whitespace-nowrap h-full w-full relative z-10',
                                            isActive
                                                ? 'text-white bg-white/15 backdrop-blur-sm shadow-lg'
                                                : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
                                        )}
                                        style={isActive ? {
                                            boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
                                        } : {}}
                                    >
                                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="hidden xl:inline">{item.label}</span>
                                    </NavLink>
                                </SpotlightCard>
                            );
                        })}
                    </div>

                    {/* Status Indicator - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                        <span
                            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
                            style={{
                                background: '#10b981',
                                boxShadow: '0 0 10px #10b981',
                            }}
                        />
                        <span className="hidden sm:inline text-xs md:text-sm font-medium text-[var(--color-text-muted)]">
                            System Active
                        </span>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
