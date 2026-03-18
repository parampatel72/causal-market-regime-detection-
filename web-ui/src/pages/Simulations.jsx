import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    Settings,
    BarChart3,
    AlertTriangle,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ButtonPrimary from '../components/ButtonPrimary';
import PageWrapper from '../components/PageWrapper';
import { useAppState } from '../hooks/useAppState';
import { ASSETS_CONFIG, MOCK_REGIME_DATA, REGIME_CONFIG } from '../data/mockData';
import CountUp from '../components/CountUp';
import { fetchMonteCarlo } from '../services/api';

/**
 * Slider Component
 */
function Slider({ label, value, onChange, min, max, step = 1, suffix = '' }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-label">{label}</span>
                <span className="text-body font-medium">{value.toLocaleString()}{suffix}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-[var(--color-surface-overlay)] rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                           [&::-webkit-slider-thumb]:bg-[var(--color-accent-primary)] [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
            />
            <div className="flex justify-between text-caption text-[var(--color-text-muted)]">
                <span>{min.toLocaleString()}</span>
                <span>{max.toLocaleString()}</span>
            </div>
        </div>
    );
}

/**
 * Simulations Page
 * Monte Carlo configuration and results display
 */
export default function Simulations() {
    const {
        selectedAssetId,
        simulationParams,
        updateSimulationParam,
        simulationResults: results,
        setSimulationResults: setResults
    } = useAppState();
    const [isRunning, setIsRunning] = useState(false);

    const selectedAsset = ASSETS_CONFIG.find(a => a.id === selectedAssetId) || ASSETS_CONFIG[0];
    const regimeData = MOCK_REGIME_DATA[selectedAssetId] || MOCK_REGIME_DATA['sp500'];
    const currentRegime = regimeData.currentRegime;
    const regimeConfig = REGIME_CONFIG[currentRegime];

    // Run simulation
    const handleRunSimulation = async () => {
        setIsRunning(true);

        try {
            const data = await fetchMonteCarlo(
                selectedAssetId,
                simulationParams.nSimulations,
                simulationParams.horizonDays
            );

            setResults({
                distribution: data.returnDistribution,
                var95: data.var95,
                var99: data.var99,
                expectedReturn: data.expectedReturn,
                volatility: data.volatility,
                stabilityScore: data.stabilityScore,
                transitionProbability: data.transitionProbability,
            });
        } catch (error) {
            console.error("Simulation failed:", error);
            // Optional: Add error state handling here
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <PageWrapper>
            <main className="container-main py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-display mb-2">Monte Carlo Simulations</h1>
                        <p className="text-caption">
                            Forward-looking uncertainty quantification for {selectedAsset.label}
                        </p>
                    </div>

                    <Badge variant={currentRegime.toLowerCase().replace(/[\s-]+/g, '')} pulse>
                        {currentRegime} Regime
                    </Badge>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Configuration Panel */}
                    <Card header="Simulation Configuration" className="lg:col-span-1">
                        <div className="space-y-6">
                            <Slider
                                label="Number of Simulations"
                                value={simulationParams.nSimulations}
                                onChange={(v) => updateSimulationParam('nSimulations', v)}
                                min={100}
                                max={10000}
                                step={100}
                            />

                            <Slider
                                label="Forecast Horizon"
                                value={simulationParams.horizonDays}
                                onChange={(v) => updateSimulationParam('horizonDays', v)}
                                min={5}
                                max={60}
                                suffix=" days"
                            />

                            <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                                <div className="text-label mb-2">Current Parameters</div>
                                <div className="space-y-2 text-caption">
                                    <div className="flex justify-between">
                                        <span>Asset</span>
                                        <span className="text-[var(--color-text-primary)]">{selectedAsset.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Current Regime</span>
                                        <Badge variant={currentRegime.toLowerCase().replace(/[\s-]+/g, '')}>
                                            {currentRegime}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Confidence</span>
                                        <span className="text-[var(--color-text-primary)]">{regimeData.confidence.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>

                            <ButtonPrimary
                                onClick={handleRunSimulation}
                                loading={isRunning}
                                icon={Play}
                                className="w-full"
                            >
                                Run Simulation
                            </ButtonPrimary>
                        </div>
                    </Card>

                    {/* Results Panel */}
                    <Card header="Simulation Results" className="lg:col-span-2">
                        {!results && !isRunning ? (
                            <div className="h-[400px] flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                                <Settings className="w-12 h-12 mb-4 opacity-50" />
                                <p className="text-center">
                                    Configure parameters and click <strong>Run Simulation</strong> to generate results
                                </p>
                            </div>
                        ) : isRunning ? (
                            <div className="h-[400px] flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center mb-6"
                                >
                                    <BarChart3 className="w-8 h-8 text-white" />
                                </motion.div>
                                <p className="animate-pulse">
                                    Running {simulationParams.nSimulations.toLocaleString()} simulations...
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Distribution Chart */}
                                <div className="h-[280px]">
                                    <ResponsiveContainer>
                                        <BarChart data={results.distribution}>
                                            <XAxis
                                                dataKey="range"
                                                tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                hide
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'var(--color-surface-overlay)' }}
                                                contentStyle={{
                                                    backgroundColor: 'var(--color-surface-elevated)',
                                                    borderColor: 'var(--color-border-subtle)',
                                                    borderRadius: '8px',
                                                    color: 'var(--color-text-primary)'
                                                }}
                                                formatter={(value) => [`${value.toLocaleString()} paths`, 'Count']}
                                            />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                {results.distribution.map((entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={entry.value < 0
                                                            ? 'var(--color-regime-volatility)'
                                                            : 'var(--color-regime-trending)'
                                                        }
                                                        opacity={0.7}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)] text-center">
                                        <div className="text-label mb-1">VaR (95%)</div>
                                        <div className="text-xl font-semibold text-[var(--color-regime-volatility)]">
                                            <CountUp value={results.var95} suffix="%" />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)] text-center">
                                        <div className="text-label mb-1">VaR (99%)</div>
                                        <div className="text-xl font-semibold text-[var(--color-regime-volatility)]">
                                            <CountUp value={results.var99} suffix="%" />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)] text-center">
                                        <div className="text-label mb-1">Expected Return</div>
                                        <div className="text-xl font-semibold text-[var(--color-regime-trending)]">
                                            +<CountUp value={results.expectedReturn} suffix="%" />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-[var(--color-surface-overlay)] text-center">
                                        <div className="text-label mb-1">Volatility</div>
                                        <div className="text-xl font-semibold">
                                            <CountUp value={results.volatility} suffix="%" />
                                        </div>
                                    </div>
                                </div>

                                {/* Insight */}
                                <div className="info-block">
                                    <p className="text-sm">
                                        Based on {simulationParams.nSimulations.toLocaleString()} Monte Carlo paths over {simulationParams.horizonDays} days,
                                        there is a <strong>{results.transitionProbability}%</strong> probability of regime transition.
                                        The 95% VaR indicates that losses should not exceed <strong>{Math.abs(results.var95)}%</strong> in
                                        95% of scenarios.
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Risk Warning */}
                <Card className="border-l-3 border-l-[var(--color-regime-rangebound)]">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-[var(--color-regime-rangebound)] flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-heading mb-1">Research Disclaimer</h4>
                            <p className="text-caption">
                                These simulations are for research and educational purposes only.
                                Monte Carlo projections are based on historical patterns and do not guarantee future outcomes.
                                Past regime behavior may not predict future transitions.
                            </p>
                        </div>
                    </div>
                </Card>
            </main>
        </PageWrapper>
    );
}
