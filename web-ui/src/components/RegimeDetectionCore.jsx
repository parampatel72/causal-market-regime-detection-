import Card from './Card';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import { REGIME_CONFIG } from '../data/mockData';

/**
 * RegimeDetectionCore Component
 * Section B - Central display of current regime and probability distribution
 */
export default function RegimeDetectionCore({ currentRegime, confidence, probabilities }) {
    // Get the variant for the current regime badge
    const getRegimeVariant = (regime) => {
        if (regime === 'Trending') return 'trending';
        if (regime === 'Range-Bound') return 'rangebound';
        if (regime === 'High Volatility') return 'volatility';
        return 'default';
    };

    // Sort probabilities by value (descending)
    const sortedProbabilities = Object.entries(probabilities)
        .sort(([, a], [, b]) => b - a);

    return (
        <Card header="Regime Detection" className="section-gap">
            {/* Dominant Regime Display */}
            <div className="mb-8">
                <span className="text-label block mb-2">Dominant Regime</span>
                <div className="flex items-baseline gap-4">
                    <span className="text-display text-[var(--color-text-primary)]">
                        {currentRegime}
                    </span>
                    <Badge variant={getRegimeVariant(currentRegime)}>
                        {confidence.toFixed(1)}% confidence
                    </Badge>
                </div>
                <p className="text-caption mt-2">
                    {REGIME_CONFIG[currentRegime]?.description}
                </p>
            </div>

            {/* Probability Distribution */}
            <div>
                <span className="text-label block mb-4">Regime Probability Distribution</span>
                <div className="max-w-lg">
                    {sortedProbabilities.map(([regime, probability]) => (
                        <ProgressBar
                            key={regime}
                            label={regime}
                            value={probability}
                            colorClass={REGIME_CONFIG[regime]?.barColor || 'bg-[#6b7d9c]'}
                        />
                    ))}
                </div>
            </div>
        </Card>
    );
}
