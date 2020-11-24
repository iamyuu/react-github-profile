import * as React from 'react';
import useSWR from 'swr';
import { client } from './api-client';

export function useRemoteData(key, overridesConfig = {}) {
  const fetcher = (...args) => client(...args);
  const swrConfig = {
    suspense: true,
    ...overridesConfig,
  };

  return useSWR(key, fetcher, swrConfig);
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
