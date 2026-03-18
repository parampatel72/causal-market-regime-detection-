import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, Activity, BarChart3, ArrowRight, BookOpen } from 'lucide-react';
import LightPillar from '../components/LightPillar';
import MinimalNavbar from '../components/MinimalNavbar';
import SpotlightCard from '../components/SpotlightCard';

/**
 * Home Page - Landing page for Causal Market Regime Detection
 * Single viewport layout with hero and features
 */

const features = [
    {
        icon: TrendingUp,
        title: 'Causal Classification',
        description: 'Rule-based regime detection with interpretable logic.',
        color: 'var(--color-regime-trending)',
    },
    {
        icon: Target,
        title: 'Probabilistic Scores',
        description: 'Calibrated probability distributions for uncertainty.',
        color: 'var(--color-regime-rangebound)',
    },
    {
        icon: Activity,
        title: 'Monte Carlo Analysis',
        description: 'Forward-looking stability and transition estimates.',
        color: 'var(--color-regime-volatility)',
    },
    {
        icon: BarChart3,
        title: 'Multi-Asset Coverage',
        description: 'Equity indices, crypto, and cross-asset analysis.',
        color: 'var(--color-accent-secondary)',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.6,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
};

export default function Home() {
    return (
        <div className="h-screen relative overflow-hidden">
            {/* LightPillar Background - Full viewport */}
            <div style={{
                position: 'absolute',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                backgroundColor: '#0B0E14',
            }}>
                <LightPillar
                    topColor="#5B5DFF"
                    bottomColor="#C6C4CA"
                    intensity={0.5}
                    rotationSpeed={0.4}
                    glowAmount={0.008}
                    pillarWidth={2.5}
                    pillarHeight={0.4}
                    noiseIntensity={0}
                    pillarRotation={222}
                    mixBlendMode="normal"
                    quality="medium"
                />
            </div>

            {/* Subtle dark overlay for text readability */}
            <div
                className="absolute inset-0"
                style={{
                    zIndex: 1,
                    background: 'radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(8, 11, 16, 0.35) 80%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Minimal Navbar */}
            <MinimalNavbar />

            {/* Main Content - Full height single viewport */}
            <main className="relative z-10 h-screen flex flex-col justify-between px-8 pt-32 pb-12">
                {/* Hero Section - Upper portion */}
                <div className="flex-1 flex flex-col justify-center items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        {/* Title */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none">
                            <span
                                className="block"
                                style={{
                                    background: 'var(--gradient-primary)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Causal
                            </span>
                            <span className="block text-[var(--color-text-primary)]">
                                Market Regime Detector
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-xl md:text-2xl text-[var(--color-text-muted)] font-medium tracking-[0.15em] uppercase mb-8"
                        >
                            Causal • Probabilistic • Research-Driven
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                        >
                            <SpotlightCard
                                className="rounded-xl overflow-hidden"
                                spotlightColor="rgba(255, 255, 255, 0.25)"
                            >
                                <Link
                                    to="/dashboard"
                                    className="group relative inline-flex items-center gap-3 px-10 py-5 text-xl font-semibold text-black overflow-hidden transition-all duration-300 w-full h-full"
                                    style={{
                                        background: 'var(--gradient-primary)',
                                    }}
                                >
                                    <span className="relative z-10">Enter Dashboard</span>
                                    <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" />
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </SpotlightCard>

                            <SpotlightCard
                                className="rounded-xl overflow-hidden"
                                spotlightColor="rgba(255, 255, 255, 0.1)"
                            >
                                <Link
                                    to="/methodology"
                                    className="group inline-flex items-center gap-3 px-10 py-5 text-xl font-semibold text-[var(--color-text-primary)] bg-transparent backdrop-blur-sm transition-all duration-300 hover:bg-[var(--color-accent-subtle)] border border-white/30 w-full h-full"
                                >
                                    <BookOpen className="w-6 h-6" />
                                    <span>View Methodology</span>
                                </Link>
                            </SpotlightCard>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Feature Cards - Bottom portion */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto w-full"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="glass-card group cursor-default p-6"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                                        style={{
                                            backgroundColor: `${feature.color}20`,
                                        }}
                                    >
                                        <feature.icon
                                            className="w-6 h-6"
                                            style={{ color: feature.color }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
