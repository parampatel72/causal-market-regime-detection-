import clsx from 'clsx';
import { TrendingUp, Minus, Zap, Bitcoin, BarChart3, DollarSign } from 'lucide-react';

/**
 * Badge Component
 * Status badge with regime/category colors and optional icon
 */
export default function Badge({
    children,
    variant = 'default',
    pulse = false,
    icon: CustomIcon,
    className
}) {
    // Auto-detect variant from children text
    const text = typeof children === 'string' ? children.toLowerCase() : '';
    let autoVariant = variant;
    let Icon = CustomIcon;

    if (variant === 'default') {
        if (text.includes('trending') || text.includes('trend')) {
            autoVariant = 'trending';
            Icon = Icon || TrendingUp;
        } else if (text.includes('range') || text.includes('consolidat')) {
            autoVariant = 'rangebound';
            Icon = Icon || Minus;
        } else if (text.includes('volatil') || text.includes('high vol')) {
            autoVariant = 'volatility';
            Icon = Icon || Zap;
        } else if (text.includes('crypto') || text.includes('btc') || text.includes('eth')) {
            autoVariant = 'crypto';
            Icon = Icon || Bitcoin;
        } else if (text.includes('equity') || text.includes('index') || text.includes('indices')) {
            autoVariant = 'equity';
            Icon = Icon || BarChart3;
        } else if (text.includes('fx') || text.includes('forex')) {
            autoVariant = 'fx';
            Icon = Icon || DollarSign;
        }
    }

    const variantClasses = {
        default: 'badge',
        trending: 'badge badge-trending',
        rangebound: 'badge badge-rangebound',
        volatility: 'badge badge-volatility',
        equity: 'badge badge-equity',
        crypto: 'badge badge-crypto',
        fx: 'badge',
    };

    return (
        <span className={clsx(
            variantClasses[autoVariant] || 'badge',
            pulse && 'badge-active',
            className
        )}>
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </span>
    );
}
