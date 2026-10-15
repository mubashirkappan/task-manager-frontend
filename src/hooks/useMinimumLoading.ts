import { useEffect, useState } from 'react';

/**
 * Keeps a loading state "on" for at least `minMs`, so a spinner doesn't flash for a
 * few milliseconds on fast responses. Only applies when the component mounts while
 * loading – data that is already available (e.g. cached) renders immediately.
 */
export const useMinimumLoading = (isLoading: boolean, minMs = 1000): boolean => {
  const [minElapsed, setMinElapsed] = useState(!isLoading);

  useEffect(() => {
    if (minElapsed) return;
    const id = setTimeout(() => setMinElapsed(true), minMs);
    return () => clearTimeout(id);
  }, [minElapsed, minMs]);

  return isLoading || !minElapsed;
};
