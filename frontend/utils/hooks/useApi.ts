'use client';

import { useState, useCallback, useEffect } from 'react';
import { AxiosError } from 'axios';
import client from '@/lib/api/client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T = unknown>(
  url: string,
  options: UseApiOptions = { immediate: true }
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await client.get<T>(url);
      setState({ data: response.data, loading: false, error: null });
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data as any;
      setState({
        data: null,
        loading: false,
        error: errorMessage?.error || error.message || 'An error occurred',
      });
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [url, options.immediate, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

export function usePost<T = unknown, R = unknown>(
  url: string
): {
  posting: boolean;
  error: string | null;
  post: (data: T) => Promise<R | null>;
} {
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = useCallback(
    async (data: T): Promise<R | null> => {
      setPosting(true);
      setError(null);
      try {
        const response = await client.post<R>(url, data);
        setPosting(false);
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data as any;
        const message = errorMessage?.error || error.message || 'An error occurred';
        setError(message);
        setPosting(false);
        return null;
      }
    },
    [url]
  );

  return { posting, error, post };
}

export function usePut<T = unknown, R = unknown>(
  url: string
): {
  updating: boolean;
  error: string | null;
  put: (data: T) => Promise<R | null>;
} {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const put = useCallback(
    async (data: T): Promise<R | null> => {
      setUpdating(true);
      setError(null);
      try {
        const response = await client.put<R>(url, data);
        setUpdating(false);
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data as any;
        const message = errorMessage?.error || error.message || 'An error occurred';
        setError(message);
        setUpdating(false);
        return null;
      }
    },
    [url]
  );

  return { updating, error, put };
}

export function useDelete(
  url: string
): {
  deleting: boolean;
  error: string | null;
  delete: () => Promise<boolean>;
} {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteResource = useCallback(async (): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    try {
      await client.delete(url);
      setDeleting(false);
      return true;
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data as any;
      const message = errorMessage?.error || error.message || 'An error occurred';
      setError(message);
      setDeleting(false);
      return false;
    }
  }, [url]);

  return { deleting, error, delete: deleteResource };
}
