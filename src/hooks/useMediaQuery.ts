'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Theo dõi một media query. Trả về `false` khi render trên server.
 * Dùng `useSyncExternalStore` để đăng ký trực tiếp với `matchMedia`,
 * tránh vòng render thừa do setState trong effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
