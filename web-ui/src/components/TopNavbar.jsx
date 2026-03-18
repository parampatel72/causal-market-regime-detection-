import { Link, useLocation } from 'react-router-dom';

/**
 * TopNavbar Component
 * Minimal navigation bar with project title and subtle links
 */
export default function TopNavbar() {
    const location = useLocation();

    return (
        <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]">
            <div className="container-main">
                <nav className="flex items-center justify-between h-16">
                    {/* Logo / Title */}
                    <Link to="/" className="flex flex-col">
                        <span className="text-[1rem] font-medium text-[var(--color-text-primary)]">
                            Causal Market Regime Detector
                        </span>
                        <span className="text-[0.6875rem] text-[var(--color-text-muted)] tracking-wide">
                            Causal • Probabilistic • Research-Driven
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/methodology"
                            className={`nav-link ${location.pathname === '/methodology' ? 'nav-link-active' : ''}`}
                        >
                            Methodology
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
