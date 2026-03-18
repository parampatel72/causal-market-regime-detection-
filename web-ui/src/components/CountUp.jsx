import { useState, useEffect } from 'react';

/**
 * CountUp Component - Animated number display
 */
export default function CountUp({ value, suffix = '', decimals = 1, duration = 800 }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const steps = 30;
        const stepDuration = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            const isFinished = increment > 0 ? current >= value : current <= value;

            if (isFinished) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(current);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [value, duration]);

    return (
        <span className="animate-count-up inline-block">
            {displayValue.toFixed(decimals)}{suffix}
        </span>
    );
}
