"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook kiểm tra xem người dùng có bật tùy chọn "reduce motion" trong hệ thống hay không.
 * Sử dụng để tắt hoặc giảm animations cho người dùng nhạy cảm với chuyển động.
 *
 * @returns `true` nếu người dùng muốn giảm chuyển động, `false` nếu không
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * const animationVariants = prefersReducedMotion
 *   ? {}
 *   : { hidden: { opacity: 0 }, show: { opacity: 1 } }
 * ```
 */
export function useReducedMotion(): boolean {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const getServerSnapshot = () => false;

  // Safe check for window availability for SSR
  const isServer = typeof window === "undefined";

  // Use useSyncExternalStore or fallback for server
  return useSyncExternalStore(
    subscribe,
    isServer ? getServerSnapshot : getSnapshot,
    getServerSnapshot
  );
}
