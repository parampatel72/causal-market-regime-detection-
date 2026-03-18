import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Minus, Zap, RefreshCw } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import Dropdown from '../components/Dropdown';
import SegmentedControl from '../components/SegmentedControl';
import RegimeHistoryChart from '../components/RegimeHistoryChart';
import LoadingState from '../components/LoadingState';
import ErrorCard from '../components/ErrorCard';
import PageWrapper from '../components/PageWrapper';
import { useApi } from '../hooks/useApi';
import { useAppState } from '../hooks/useAppState';
import { fetchRegime, fetchProbabilities, fetchMonteCarlo } from '../services/api';
import { ASSETS_CONFIG, MOCK_HISTORY, REGIME_CONFIG } from '../data/mockData';

import CountUp from '../components/CountUp';

/**
 * RegimeIcon Component
 */
function RegimeIcon({ regime, className }) {
    const icons = {
        'Trending': TrendingUp,
        'Range-Bound': Minus,
        'High Volatility': Zap,
    };
    const Icon = icons[regime] || TrendingUp;
    return <Icon className={className} />;
}

/**
 * Dashboard Page
 * Main dashboard with regime detection, probabilities, and stability metrics
 */
export default function Dashboard() {
    const {
        selectedAssetId,
        setSelectedAssetId,
        timeframe,
        setTimeframe,
        simulationParams,
        simulationResults
    } = useAppState();

    // Get static asset config
    const selectedAsset = ASSETS_CONFIG.find(a => a.id === selectedAssetId) || ASSETS_CONFIG[0];

    // API calls
    const {
        data: regimeData,
        loading: regimeLoading,
        error: regimeError,
        retry: retryRegime
    } = useApi(
        useCallback(() => fetchRegime(selectedAssetId), [selectedAssetId]),
        [selectedAssetId]
    );

    const {
        data: probData,
        loading: probLoading,
        error: probError,
        retry: retryProb
    } = useApi(
        useCallback(() => fetchProbabilities(selectedAssetId), [selectedAssetId]),
        [selectedAssetId]
    );

    const {
        data: mcData,
        loading: mcLoading,
        error: mcError,
        retry: retryMC
    } = useApi(
        useCallback(() => fetchMonteCarlo(selectedAssetId), [selectedAssetId]),
        [selectedAssetId]
    );

    const isLoading = regimeLoading || probLoading || mcLoading;
    const error = regimeError || probError || mcError;

    const handleRetry = () => {
        if (regimeError) retryRegime();
        if (probError) retryProb();
        if (mcError) retryMC();
    };

    // Build display data with fallbacks
    const displayData = {
        currentRegime: regimeData?.currentRegime || 'Trending',
        confidence: regimeData?.confidence || 72.5,
        probabilities: probData?.probabilities || { 'Trending': 0.725, 'Range-Bound': 0.185, 'High Volatility': 0.090 },
        stability: {
            stabilityScore: simulationResults?.stabilityScore ?? mcData?.stabilityScore ?? 68.0,
            transitionProbability: simulationResults?.transitionProbability ?? mcData?.transitionProbability ?? 32.0,
            horizonDays: simulationParams.horizonDays,
            nSimulations: simulationParams.nSimulations,
        }
    };

    const historyData = MOCK_HISTORY[selectedAssetId] || MOCK_HISTORY['sp500'];
    const regimeConfig = REGIME_CONFIG[displayData.currentRegime] || REGIME_CONFIG['Trending'];

    // Loading state
    if (isLoading && !regimeData) {
        return (
            <PageWrapper>
                <main className="container-main py-8">
                    <LoadingState message={`Analyzing ${selectedAsset.label} regime...`} />
                </main>
            </PageWrapper>
        );
    }

    // Error state
    if (error && !regimeData) {
        return (
            <PageWrapper>
                <main className="container-main py-8">
                    <ErrorCard
                        error={error}
                        onRetry={handleRetry}
                        title="Failed to load regime data"
                    />
                </main>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <main className="container-main py-10 space-y-8">
                {/* Top Controls */}
                <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-6 items-center">
                        <Dropdown
                            label="Asset"
                            options={ASSETS_CONFIG}
                            value={selectedAssetId}
                            onChange={setSelectedAssetId}
                        />
                        <div className="flex flex-col">
                            <span className="text-label mb-2">Timeframe</span>
                            <SegmentedControl
                                options={[
                                    { id: 'daily', label: 'Daily' },
                                    { id: 'weekly', label: 'Weekly' }
                                ]}
                                value={timeframe}
                                onChange={setTimeframe}
                                size="sm"
                            />
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex items-center gap-3 text-[var(--color-accent-primary)] text-base">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Updating...
                        </div>
                    )}
                </section>

                {/* Main Grid - 3 Column */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Current Regime */}
                    <Card regime={displayData.currentRegime} className="lg:col-span-1">
                        <div className="text-center py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                style={{ backgroundColor: regimeConfig.bgColor }}
                            >
                                <RegimeIcon
                                    regime={displayData.currentRegime}
                                    className="w-10 h-10"
                                    style={{ color: regimeConfig.color }}
                                />
                            </motion.div>

                            <Badge variant={displayData.currentRegime.toLowerCase().replace(/[\s-]+/g, '')} pulse>
                                {displayData.currentRegime}
                            </Badge>

                            <div className="mt-4">
                                <div className="metric-value" style={{ color: regimeConfig.color }}>
                                    <CountUp value={displayData.confidence} suffix="%" />
                                </div>
                                <div className="metric-label">Confidence</div>
                            </div>

                            <p className="text-caption mt-4">{regimeConfig.description}</p>
                        </div>
                    </Card>

                    {/* Center Column - Probability Distribution */}
                    <Card header="Regime Probabilities" className="lg:col-span-1">
                        <div className="space-y-4">
                            {Object.entries(displayData.probabilities).map(([regime, prob]) => (
                                <div key={regime}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-body">{regime}</span>
                                        <span className="text-caption font-medium">
                                            {(prob * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={prob * 100}
                                        max={100}
                                        regime={regime.toLowerCase().replace(/[\s-]+/g, '')}
                                        size="md"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="info-block mt-6">
                            <p className="text-sm">
                                Probabilities are calibrated using logistic regression trained on
                                rule-based causal labels. Higher values indicate stronger regime signals.
                            </p>
                        </div>
                    </Card>

                    {/* Right Column - Stability Metrics */}
                    <Card header="Stability Analysis" className="lg:col-span-1">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center p-3 rounded-lg bg-[var(--color-surface-overlay)]">
                                <div className="metric-value text-2xl">
                                    <CountUp value={displayData.stability.stabilityScore} suffix="%" />
                                </div>
                                <div className="metric-label">Stability</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-[var(--color-surface-overlay)]">
                                <div className="metric-value text-2xl">
                                    <CountUp value={displayData.stability.transitionProbability} suffix="%" />
                                </div>
                                <div className="metric-label">Transition Risk</div>
                            </div>
                        </div>

                        <div className="flex justify-between text-caption mb-4">
                            <span>Horizon: {displayData.stability.horizonDays} days</span>
                            <span>{displayData.stability.nSimulations.toLocaleString()} simulations</span>
                        </div>

                        <div className="info-block">
                            <p className="text-sm">
                                Monte Carlo analysis estimates a <strong>{displayData.stability.transitionProbability}%</strong> probability
                                of regime transition within {displayData.stability.horizonDays} trading days.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Regime History Chart */}
                <Card header="Historical Regime Analysis" className="overflow-hidden">
                    <div className="h-[320px] -mx-4 -mb-4">
                        <RegimeHistoryChart data={historyData} height={320} />
                    </div>
                </Card>

                {/* Insight Summary */}
                <Card className="border-l-[3px]" style={{ borderLeftColor: regimeConfig.color }}>
                    <h4 className="text-heading mb-3">Market Insight</h4>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        <strong>{selectedAsset.label}</strong> is currently in a <Badge variant={displayData.currentRegime.toLowerCase().replace(/[\s-]+/g, '')}>{displayData.currentRegime}</Badge> regime
                        with <strong>{displayData.confidence.toFixed(1)}%</strong> confidence.
                        The regime shows <strong>{displayData.stability.stabilityScore > 60 ? 'moderate' : 'low'} stability</strong> with
                        a {displayData.stability.transitionProbability}% probability of transitioning to a different state
                        within the next {displayData.stability.horizonDays} trading days.
                    </p>
                </Card>
            </main>
        </PageWrapper>
    );
}
