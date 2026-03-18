import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApi Hook
 * Enhanced API fetching with timeout, retry, and error categorization
 */

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

export function useApi(fetchFn, deps = [], options = {}) {
    const {
        timeout = DEFAULT_TIMEOUT,
        maxRetries = MAX_RETRIES,
        retryDelay = RETRY_DELAY,
        enabled = true,
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const abortControllerRef = useRef(null);
    const mountedRef = useRef(true);

    const execute = useCallback(async (isRetry = false) => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        if (!isRetry) {
            setLoading(true);
            setError(null);
        }

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), timeout);
        });

        try {
            // Race between fetch and timeout
            const result = await Promise.race([
                fetchFn(abortControllerRef.current.signal),
                timeoutPromise
            ]);

            if (mountedRef.current) {
                setData(result);
                setError(null);
                setRetryCount(0);
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                return; // Ignore aborted requests
            }

            if (mountedRef.current) {
                // Check if should retry
                if (retryCount < maxRetries && !isRetry) {
                    setRetryCount(prev => prev + 1);
                    // Exponential backoff
                    const delay = retryDelay * Math.pow(2, retryCount);
                    setTimeout(() => execute(true), delay);
                    return;
                }

                setError(err.message || 'An error occurred');
            }
        } finally {
            if (mountedRef.current && !isRetry) {
                setLoading(false);
            }
        }
    }, [fetchFn, enabled, timeout, maxRetries, retryDelay, retryCount]);

    const retry = useCallback(() => {
        setRetryCount(0);
        execute();
    }, [execute]);

    useEffect(() => {
        mountedRef.current = true;
        execute();

        return () => {
            mountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [...deps, execute]);

    return {
        data,
        loading,
        error,
        retry,
        isRetrying: retryCount > 0,
    };
}

export default useApi;
