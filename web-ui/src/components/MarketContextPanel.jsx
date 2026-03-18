import Card from './Card';
import Badge from './Badge';

/**
 * MarketContextPanel Component
 * Section A - Displays selected asset, time horizon, and last updated timestamp
 */
export default function MarketContextPanel({ asset, ticker, timeHorizon, lastUpdated }) {
    // Format the timestamp
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
        });
    };

    return (
        <Card className="section-gap">
            <div className="flex flex-wrap items-center gap-6">
                {/* Asset */}
                <div className="flex flex-col gap-1">
                    <span className="text-label">Selected Asset</span>
                    <div className="flex items-center gap-2">
                        <span className="text-body font-medium text-[var(--color-text-primary)]">
                            {asset}
                        </span>
                        <Badge>{ticker}</Badge>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-10 w-px bg-[var(--color-border-subtle)]" />

                {/* Time Horizon */}
                <div className="flex flex-col gap-1">
                    <span className="text-label">Time Horizon</span>
                    <span className="text-body text-[var(--color-text-primary)]">{timeHorizon}</span>
                </div>

                {/* Divider */}
                <div className="h-10 w-px bg-[var(--color-border-subtle)]" />

                {/* Last Updated */}
                <div className="flex flex-col gap-1">
                    <span className="text-label">Last Updated</span>
                    <span className="text-body text-[var(--color-text-secondary)]">
                        {formatDate(lastUpdated)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
