import { createContext, useContext, useState, useCallback } from 'react';

/**
 * AppState Context
 * Centralized state for selected asset, timeframe, and simulation parameters
 */

const AppStateContext = createContext(null);

const DEFAULT_STATE = {
    selectedAssetId: 'sp500',
    timeframe: 'daily',
    simulationParams: {
        nSimulations: 1000,
        horizonDays: 20,
    },
    simulationResults: null,
};

export function AppStateProvider({ children }) {
    const [selectedAssetId, setSelectedAssetId] = useState(DEFAULT_STATE.selectedAssetId);
    const [timeframe, setTimeframe] = useState(DEFAULT_STATE.timeframe);
    const [simulationParams, setSimulationParams] = useState(DEFAULT_STATE.simulationParams);
    const [simulationResults, setSimulationResults] = useState(DEFAULT_STATE.simulationResults);
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);

    const updateSimulationParam = useCallback((key, value) => {
        setSimulationParams(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetState = useCallback(() => {
        setSelectedAssetId(DEFAULT_STATE.selectedAssetId);
        setTimeframe(DEFAULT_STATE.timeframe);
        setSimulationParams(DEFAULT_STATE.simulationParams);
        setSimulationResults(DEFAULT_STATE.simulationResults);
    }, []);

    const value = {
        // Asset selection
        selectedAssetId,
        setSelectedAssetId,

        // Timeframe
        timeframe,
        setTimeframe,

        // Simulation
        simulationParams,
        setSimulationParams,
        updateSimulationParam,

        // Simulation Results
        simulationResults,
        setSimulationResults,

        // Global loading
        isGlobalLoading,
        setIsGlobalLoading,

        // Reset
        resetState,
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return context;
}

export default useAppState;
