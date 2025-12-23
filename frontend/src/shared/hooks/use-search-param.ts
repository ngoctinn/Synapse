"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export interface UseSearchParamOptions {
  /** URL param name (default: "q") */
  paramName?: string;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  /** Params to reset when search changes (e.g., ["page"]) */
  resetParams?: string[];
  /** Whether to trim value before setting (default: true) */
  trim?: boolean;
}

export interface UseSearchParamReturn {
  /** Current search value */
  value: string;
  /** Set search value (debounced URL update) */
  setValue: (value: string) => void;
  /** Clear search value */
  clear: () => void;
  /** Whether URL update is pending */
  isPending: boolean;
}

/**
 * Hook for syncing search input with URL search params
 *
 * Features:
 * - Debounced URL updates (default 300ms)
 * - Single router.replace call per update
 * - Trim value before setting
 * - Reset other params (e.g., page) when search changes
 * - Pending state for loading indicators
 */
export function useSearchParam(
  options: UseSearchParamOptions = {}
): UseSearchParamReturn {
  const {
    paramName = "q",
    debounceMs = 300,
    resetParams = [],
    trim = true,
  } = options;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize from URL
  const [value, setValueState] = useState(
    searchParams.get(paramName)?.toString() || ""
  );

  // Debounced URL update - single call only
  const updateUrl = useDebouncedCallback((newValue: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      const processedValue = trim ? newValue.trim() : newValue;

      if (processedValue) {
        params.set(paramName, processedValue);
      } else {
        params.delete(paramName);
      }

      // Reset specified params (e.g., page -> 1)
      for (const param of resetParams) {
        params.delete(param);
      }

      router.replace(`${pathname}?${params.toString()}`);
    });
  }, debounceMs);

  const setValue = useCallback(
    (newValue: string) => {
      setValueState(newValue);
      updateUrl(newValue);
    },
    [updateUrl]
  );

  const clear = useCallback(() => {
    setValueState("");
    updateUrl("");
  }, [updateUrl]);

  return {
    value,
    setValue,
    clear,
    isPending,
  };
}
