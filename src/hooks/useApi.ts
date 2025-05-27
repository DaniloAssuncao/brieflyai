import { useState, useCallback } from 'react';
import { ApiResponse, AsyncState } from '@/types';

interface UseApiOptions<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export function useApi<T = unknown>(options: UseApiOptions<T> = {}) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const callApi = useCallback(async (
    url: string,
    apiOptions: ApiCallOptions = {}
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { method = 'GET', headers = {}, body } = apiOptions;

      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'API call failed');
      }

      setState({
        data: result.data || null,
        loading: false,
        error: null,
      });

      if (result.data !== undefined) {
        options.onSuccess?.(result.data);
      }
      return result.data || null;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      options.onError?.(errorMessage);
      return null;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    callApi,
    reset,
  };
}

// Specialized hooks for common API patterns
export function useApiMutation<TData = unknown, TVariables = unknown>(
  url: string,
  options: UseApiOptions<TData> = {}
) {
  const { callApi, loading, error } = useApi<TData>(options);

  const mutate = useCallback(
    (variables: TVariables, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST') => {
      return callApi(url, {
        method,
        body: variables,
      });
    },
    [callApi, url]
  );

  return {
    mutate,
    loading,
    error,
  };
}

export function useApiQuery<T = unknown>(
  url: string,
  options: UseApiOptions<T> = {}
) {
  const { callApi, data, loading, error, reset } = useApi<T>(options);

  const refetch = useCallback(() => {
    return callApi(url);
  }, [callApi, url]);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
} 