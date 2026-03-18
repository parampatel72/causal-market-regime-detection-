import Card from './Card';
import Metric from './Metric';

/**
 * RegimeStability Component
 * Section C - Monte Carlo stability analysis and natural language explanation
 */
export default function RegimeStability({ stability, explanation }) {
    // Guard against undefined stability data
    if (!stability) {
        return (
            <Card header="Regime Stability & Uncertainty" className="section-gap">
                <div className="text-center text-[var(--color-text-muted)] py-8">
                    Loading stability data...
                </div>
            </Card>
        );
    }

    return (
        <Card header="Regime Stability & Uncertainty" className="section-gap">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <Metric
                    label="Stability Score"
                    value={stability.stabilityScore.toFixed(0)}
                    suffix="%"
                />
                <Metric
                    label="Transition Probability"
                    value={stability.transitionProbability.toFixed(0)}
                    suffix="%"
                />
                <Metric
                    label="Simulation Horizon"
                    value={stability.horizonDays}
                    suffix=" days"
                />
            </div>

            {/* Simulation Info */}
            <p className="text-caption mb-4">
                Based on {stability.nSimulations.toLocaleString()} Monte Carlo simulations
            </p>

            {/* Natural Language Explanation */}
            <div className="info-block">
                <p className="whitespace-pre-line">{explanation}</p>
            </div>
        </Card>
    );
}
