import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    Target,
    Shield,
    Github,
    Linkedin,
    Mail,
    ExternalLink,
    Activity,
    Code,
    BarChart3
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PageWrapper from '../components/PageWrapper';

/**
 * About Page
 * Research intent, team, and project positioning
 */
export default function About() {
    const features = [
        {
            icon: Target,
            title: 'Research-First Design',
            description: 'Built for quantitative research and academic exploration, not trading signals or financial advice.',
            color: 'var(--color-regime-trending)',
        },
        {
            icon: Shield,
            title: 'Interpretability Focus',
            description: 'Every output can be traced back to interpretable inputs. No black-box predictions.',
            color: 'var(--color-regime-rangebound)',
        },
        {
            icon: BarChart3,
            title: 'Uncertainty Quantification',
            description: 'Probabilistic outputs and Monte Carlo methods provide confidence intervals, not point estimates.',
            color: 'var(--color-regime-volatility)',
        },
    ];

    const techStack = [
        { name: 'Python', category: 'Backend' },
        { name: 'FastAPI', category: 'Backend' },
        { name: 'scikit-learn', category: 'ML' },
        { name: 'NumPy', category: 'Compute' },
        { name: 'React', category: 'Frontend' },
        { name: 'Vite', category: 'Frontend' },
        { name: 'Tailwind CSS', category: 'Frontend' },
        { name: 'Recharts', category: 'Visualization' },
    ];

    return (
        <PageWrapper>
            <main className="container-main py-6 space-y-8">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto py-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center mx-auto mb-6"
                    >
                        <Activity className="w-10 h-10 text-white" />
                    </motion.div>

                    <h1 className="text-display text-4xl mb-4">
                        Causal Market Regime Detector
                    </h1>

                    <p className="text-xl text-[var(--color-text-secondary)] mb-6">
                        A quantitative research platform for understanding market state dynamics
                        through causal logic, probabilistic classification, and Monte Carlo simulation.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2">
                        <Badge>Causal Inference</Badge>
                        <Badge>Probabilistic ML</Badge>
                        <Badge>Monte Carlo</Badge>
                        <Badge>Research Tool</Badge>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${feature.color}20` }}
                                >
                                    <feature.icon
                                        className="w-6 h-6"
                                        style={{ color: feature.color }}
                                    />
                                </div>
                                <h3 className="text-heading mb-2">{feature.title}</h3>
                                <p className="text-caption">{feature.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works */}
                <Card header="How It Works">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: 1, title: 'Data Ingestion', desc: 'Fetch historical price data from market sources' },
                            { step: 2, title: 'Feature Engineering', desc: 'Compute technical indicators and statistical features' },
                            { step: 3, title: 'Regime Classification', desc: 'Apply rule-based labels and probabilistic classification' },
                            { step: 4, title: 'Uncertainty Analysis', desc: 'Run Monte Carlo simulations for stability metrics' },
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center mx-auto mb-3 text-white font-bold">
                                    {item.step}
                                </div>
                                <h4 className="text-heading text-sm mb-1">{item.title}</h4>
                                <p className="text-caption text-xs">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* Tech Stack */}
                <Card header="Technology Stack">
                    <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                            <span
                                key={tech.name}
                                className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-overlay)] text-sm border border-[var(--color-border-subtle)]"
                            >
                                <span className="text-[var(--color-text-muted)] mr-2">{tech.category}:</span>
                                <span className="text-[var(--color-text-primary)]">{tech.name}</span>
                            </span>
                        ))}
                    </div>
                </Card>

                {/* Research Intent */}
                <Card className="border-l-3 border-l-[var(--color-accent-primary)]">
                    <div className="flex items-start gap-4">
                        <BookOpen className="w-8 h-8 text-[var(--color-accent-primary)] flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-heading mb-3">Research Intent</h3>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                                This project is designed for quantitative research, academic exploration,
                                and portfolio demonstration purposes. It is explicitly <strong>not</strong> a
                                trading system or financial advice tool.
                            </p>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                The focus is on <strong>interpretability</strong>, <strong>uncertainty quantification</strong>,
                                and <strong>methodological transparency</strong>—principles that are often
                                absent from commercial regime detection offerings.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Use Cases */}
                <Card header="Intended Use Cases">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: 'Academic Research', desc: 'Explore regime dynamics and classification methods' },
                            { title: 'Portfolio Demonstration', desc: 'Showcase quantitative and software engineering skills' },
                            { title: 'Learning Platform', desc: 'Understand Monte Carlo methods and probabilistic ML' },
                            { title: 'Research Presentation', desc: 'Present regime detection concepts visually' },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-4 rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-border-subtle)]"
                            >
                                <h4 className="text-heading text-sm mb-1">{item.title}</h4>
                                <p className="text-caption">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-center py-8 border-t border-[var(--color-border-subtle)]">
                    <p className="text-caption mb-4">
                        Built with care for the quantitative research community
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="#"
                            className="p-2 rounded-lg bg-[var(--color-surface-overlay)] hover:bg-[var(--color-accent-subtle)] transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="p-2 rounded-lg bg-[var(--color-surface-overlay)] hover:bg-[var(--color-accent-subtle)] transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="p-2 rounded-lg bg-[var(--color-surface-overlay)] hover:bg-[var(--color-accent-subtle)] transition-colors"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </main>
        </PageWrapper>
    );
}
