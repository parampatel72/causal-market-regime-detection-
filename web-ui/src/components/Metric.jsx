/**
 * Metric Component
 * Display numerical values with labels
 */
export default function Metric({ label, value, suffix = '', className = '' }) {
    return (
        <div className={`metric ${className}`}>
            <span className="metric-label">{label}</span>
            <span className="metric-value">
                {value}{suffix}
            </span>
        </div>
    );
}
