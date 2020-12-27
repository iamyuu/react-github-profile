import * as React from 'react';
import { useSWRInfinite } from 'swr';

export function useDebounce(value, delay = 500) {
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

export function useIntersection({ threshold, rootMargin, root }) {
  const node = React.useRef(null);
  const [entry, setEntry] = React.useState({});

  React.useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entries]) => setEntry(entries),
      { threshold, rootMargin, root }
    );

    if (node.current) {
      observer.observe(node.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [node, threshold, rootMargin, root]);

  return [node, entry];
}

export function useInfiniteScroll(
  endpoint,
  { pageSize = 10, observer: customObserver, ...swrConfig } = {}
) {
  const [ref, { isIntersecting }] = useIntersection({
    threshold: 0.75,
    ...customObserver,
  });

  const { data, size, setSize, ...swrResult } = useSWRInfinite(
    index =>
      endpoint ? `${endpoint}?per_page=${pageSize}&page=${index + 1}` : null,
    swrConfig
  );

  const items = data ? [].concat(...data) : [];
  const isEmpty = data?.[0]?.length === 0;
  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === 'undefined';
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1].length < pageSize);

  React.useEffect(() => {
    if (isIntersecting && !isLoadingMore && !isReachingEnd) {
      setSize(currentSize => currentSize + 1);
    }
  }, [setSize, isIntersecting, isLoadingMore, isReachingEnd]);

  return { ref, items, isEmpty, isLoadingMore, isReachingEnd, ...swrResult };
}
