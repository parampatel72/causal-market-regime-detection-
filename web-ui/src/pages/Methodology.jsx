import { motion } from 'framer-motion';
import { BookOpen, Code, BarChart3, Activity, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import { AccordionItem } from '../components/Accordion';
import PageWrapper from '../components/PageWrapper';
import { METHODOLOGY_SECTIONS } from '../data/mockData';

/**
 * Methodology Page
 * Detailed explanation of regime detection methodology
 */
export default function Methodology() {
    const icons = {
        'regimes': BarChart3,
        'causal': Code,
        'probabilistic': Activity,
        'montecarlo': BarChart3,
    };

    return (
        <PageWrapper>
            <main className="container-main py-6 space-y-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center mx-auto mb-6"
                    >
                        <BookOpen className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-display mb-4">Methodology</h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Understanding the causal, probabilistic approach to market regime detection
                    </p>
                </div>

                {/* Quick Navigation */}
                <Card className="mb-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {METHODOLOGY_SECTIONS.map((section) => {
                            const Icon = icons[section.id] || ChevronRight;
                            return (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface-overlay)] 
                                         hover:bg-[var(--color-accent-subtle)] transition-colors text-sm"
                                >
                                    <Icon className="w-4 h-4 text-[var(--color-accent-primary)]" />
                                    <span>{section.title}</span>
                                </a>
                            );
                        })}
                    </div>
                </Card>

                {/* Accordion Sections */}
                <Card>
                    {METHODOLOGY_SECTIONS.map((section, index) => (
                        <motion.div
                            key={section.id}
                            id={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <AccordionItem
                                title={
                                    <span className="flex items-center gap-3">
                                        {(() => {
                                            const Icon = icons[section.id] || ChevronRight;
                                            return (
                                                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-subtle)] flex items-center justify-center">
                                                    <Icon className="w-4 h-4 text-[var(--color-accent-primary)]" />
                                                </div>
                                            );
                                        })()}
                                        {section.title}
                                    </span>
                                }
                                defaultOpen={index === 0}
                            >
                                <div className="pl-11 prose prose-invert max-w-none">
                                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                                        <p
                                            key={pIndex}
                                            className="text-[var(--color-text-secondary)] leading-relaxed mb-4 whitespace-pre-line"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Card>

                {/* Key Principles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(56,189,248,0.15)] flex items-center justify-center mx-auto mb-4">
                            <Code className="w-6 h-6 text-[var(--color-regime-trending)]" />
                        </div>
                        <h3 className="text-heading mb-2">Interpretability</h3>
                        <p className="text-caption">
                            Every classification traces back to specific, understandable market conditions
                        </p>
                    </Card>

                    <Card className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(251,191,36,0.15)] flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-6 h-6 text-[var(--color-regime-rangebound)]" />
                        </div>
                        <h3 className="text-heading mb-2">Uncertainty</h3>
                        <p className="text-caption">
                            Probabilistic outputs quantify confidence rather than making hard predictions
                        </p>
                    </Card>

                    <Card className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(244,114,182,0.15)] flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-6 h-6 text-[var(--color-regime-volatility)]" />
                        </div>
                        <h3 className="text-heading mb-2">Forward-Looking</h3>
                        <p className="text-caption">
                            Monte Carlo methods project regime stability into the future
                        </p>
                    </Card>
                </div>

                {/* Research Note */}
                <Card className="border-l-3 border-l-[var(--color-accent-primary)]">
                    <h4 className="text-heading mb-3">Research Foundation</h4>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        This methodology builds on established research in regime-switching models,
                        technical analysis, and probabilistic machine learning. The combination of
                        rule-based causal logic with calibrated probabilistic classifiers provides
                        both interpretability and uncertainty quantification—two properties essential
                        for responsible quantitative research.
                    </p>
                </Card>
            </main>
        </PageWrapper>
    );
}
