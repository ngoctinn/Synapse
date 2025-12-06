"use client"

import { useEffect, useState } from "react"

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return prefersReducedMotion
}
