'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Trả về `true` khi trang đã cuộn quá `threshold` pixel.
 * Đăng ký trực tiếp với sự kiện scroll qua `useSyncExternalStore` để
 * tránh setState trong effect và giảm số lần render.
 */
export function useScrolled(threshold = 12): boolean {
  const frame = useRef(0);

  const subscribe = useCallback((onChange: () => void) => {
    const handler = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(onChange);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', handler);
    };
  }, []);

  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
