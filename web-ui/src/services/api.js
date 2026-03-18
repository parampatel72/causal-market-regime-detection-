/**
 * API Service Layer
 * Centralized API calls to FastAPI backend
 */

const API_BASE = import.meta.env?.PROD ? '/api' : 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Unable to connect to backend. Is the API server running?');
        }
        throw error;
    }
}

/**
 * Check API health status
 */
export async function checkHealth() {
    return fetchAPI('/health');
}

/**
 * Get list of available assets
 */
export async function fetchAssets() {
    const data = await fetchAPI('/assets');
    return data.assets;
}

/**
 * Get current regime for an asset
 * @param {string} assetId - Asset ID (e.g., 'sp500', 'btc')
 */
export async function fetchRegime(assetId) {
    return fetchAPI(`/regime/${assetId}`);
}

/**
 * Get probability distribution for an asset
 * @param {string} assetId - Asset ID
 */
export async function fetchProbabilities(assetId) {
    return fetchAPI(`/probabilities/${assetId}`);
}

/**
 * Get Monte Carlo stability analysis
 * @param {string} assetId - Asset ID
 * @param {number} simulations - Number of simulations (default 1000)
 * @param {number} horizon - Horizon in days (default 20)
 */
export async function fetchMonteCarlo(assetId, simulations = 1000, horizon = 20) {
    return fetchAPI(`/monte-carlo/${assetId}?simulations=${simulations}&horizon=${horizon}`);
}

/**
 * Fetch all data for an asset at once
 * @param {string} assetId - Asset ID
 */
export async function fetchAllAssetData(assetId) {
    const [regime, probabilities, monteCarlo] = await Promise.all([
        fetchRegime(assetId),
        fetchProbabilities(assetId),
        fetchMonteCarlo(assetId),
    ]);

    return {
        regime,
        probabilities,
        monteCarlo,
    };
}

export default {
    checkHealth,
    fetchAssets,
    fetchRegime,
    fetchProbabilities,
    fetchMonteCarlo,
    fetchAllAssetData,
};
