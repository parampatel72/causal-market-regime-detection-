import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Landmark,
    Bitcoin,
    Cpu,
    Zap,
    Repeat,
    ArrowRight,
    BarChart3
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SegmentedControl from '../components/SegmentedControl';
import PageWrapper from '../components/PageWrapper';
import { useAppState } from '../hooks/useAppState';
import { ASSETS_CONFIG, MOCK_REGIME_DATA, REGIME_CONFIG } from '../data/mockData';
import { fetchRegime } from '../services/api';

// Icon mapping for assets
const assetIcons = {
    'sp500': TrendingUp,
    'nifty': TrendingUp,
    'banknifty': Landmark,
    'btc': Bitcoin,
    'eth': Cpu,
    'sol': Zap,
    'xrp': Repeat,
};

// Category filters
const CATEGORIES = [
    { id: 'all', label: 'All Assets' },
    { id: 'indices', label: 'Indices' },
    { id: 'crypto', label: 'Crypto' },
];

/**
 * AssetCard Component
 */
function AssetCard({ asset, isSelected, onSelect, regimeData, loading }) {
    const Icon = assetIcons[asset.id] || BarChart3;

    // Use passed regime data or fallback to mock if loading/error
    const data = regimeData || MOCK_REGIME_DATA[asset.id];
    const regime = data?.currentRegime || 'Trending';
    const confidence = data?.confidence || 70;
    const regimeConfig = REGIME_CONFIG[regime] || REGIME_CONFIG['Trending'];

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className="h-full"
        >
            <Card
                className={`cursor-pointer transition-all h-full flex flex-col ${isSelected
                    ? 'ring-2 ring-[var(--color-accent-primary)] border-[var(--color-accent-primary)]'
                    : ''
                    }`}
                hoverable={false}
            >
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                            backgroundColor: asset.category === 'crypto'
                                ? 'rgba(167, 139, 250, 0.15)'
                                : 'rgba(96, 165, 250, 0.15)',
                            color: asset.category === 'crypto'
                                ? 'var(--color-category-crypto)'
                                : 'var(--color-category-equity)'
                        }}
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                    {isSelected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                    )}
                </div>

                <h3 className="text-heading mb-1">{asset.label}</h3>
                <p className="text-caption mb-3">{asset.ticker}</p>

                <div className="flex items-center gap-2 mb-4">
                    <Badge>{asset.badge}</Badge>
                </div>

                {/* Current Regime */}
                <div
                    className="p-3 rounded-lg mt-auto"
                    style={{ backgroundColor: regimeConfig?.bgColor || 'var(--color-surface-overlay)' }}
                >
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-label whitespace-nowrap">Regime</span>
                        {loading && !regimeData ? (
                            <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
                        ) : (
                            <Badge variant={regime.toLowerCase().replace(/[\s-]+/g, '')}>
                                {regime}
                            </Badge>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-caption">Confidence</span>
                        {loading && !regimeData ? (
                            <div className="h-5 w-10 bg-white/10 rounded animate-pulse" />
                        ) : (
                            <span
                                className="font-semibold"
                                style={{ color: regimeConfig?.color }}
                            >
                                {confidence.toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

/**
 * Assets Page
 * Asset selection with filtering and category tabs
 */
export default function Assets() {
    const { selectedAssetId, setSelectedAssetId } = useAppState();
    const [category, setCategory] = useState('all');
    const [regimeDataMap, setRegimeDataMap] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch live regime data for all assets
    useEffect(() => {
        const loadAllRegimes = async () => {
            setLoading(true);
            try {
                // Fetch in parallel
                const results = await Promise.all(
                    ASSETS_CONFIG.map(async (asset) => {
                        try {
                            const data = await fetchRegime(asset.id);
                            return { id: asset.id, data };
                        } catch (err) {
                            console.warn(`Failed to fetch regime for ${asset.id}`, err);
                            return null;
                        }
                    })
                );

                const newMap = {};
                results.forEach((item) => {
                    if (item) {
                        newMap[item.id] = item.data;
                    }
                });

                if (Object.keys(newMap).length > 0) {
                    setRegimeDataMap(newMap);
                }
            } catch (error) {
                console.error("Failed to load assets data", error);
            } finally {
                setLoading(false);
            }
        };

        loadAllRegimes();
    }, []);

    const filteredAssets = category === 'all'
        ? ASSETS_CONFIG
        : ASSETS_CONFIG.filter(a => a.category === category);

    const selectedAsset = ASSETS_CONFIG.find(a => a.id === selectedAssetId);

    return (
        <PageWrapper>
            <main className="container-main py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-display mb-2">Assets</h1>
                        <p className="text-caption">
                            Select an asset to analyze its market regime
                        </p>
                    </div>

                    <SegmentedControl
                        options={CATEGORIES}
                        value={category}
                        onChange={setCategory}
                    />
                </div>

                {/* Asset Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    layout
                >
                    {filteredAssets.map((asset, index) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                        >
                            <AssetCard
                                asset={asset}
                                isSelected={selectedAssetId === asset.id}
                                onSelect={() => setSelectedAssetId(asset.id)}
                                regimeData={regimeDataMap[asset.id]}
                                loading={loading}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Selected Asset Summary */}
                {selectedAsset && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center">
                                    {(() => {
                                        const Icon = assetIcons[selectedAsset.id] || BarChart3;
                                        return <Icon className="w-6 h-6 text-white" />;
                                    })()}
                                </div>
                                <div>
                                    <h3 className="text-heading">{selectedAsset.label}</h3>
                                    <p className="text-caption">
                                        {selectedAsset.ticker} • {selectedAsset.description || selectedAsset.badge}
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/dashboard"
                                className="btn-primary flex items-center gap-2"
                            >
                                View Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Card>
                    </motion.div>
                )}

                {/* Categories Legend */}
                <div className="flex flex-wrap gap-4 justify-center py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[var(--color-category-equity)]" />
                        <span className="text-caption">Equity Indices</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[var(--color-category-crypto)]" />
                        <span className="text-caption">Cryptocurrencies</span>
                    </div>
                </div>
            </main>
        </PageWrapper>
    );
}
