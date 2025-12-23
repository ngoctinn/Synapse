"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseTableParamsOptions {
  /** Default sort column if not in URL */
  defaultSortBy?: string;
  /** Default sort order if not in URL */
  defaultOrder?: "asc" | "desc";
}

interface UseTableParamsReturn {
  /** Current page number (1-indexed) */
  page: number;
  /** Current sort column */
  sortBy: string;
  /** Current sort direction */
  order: "asc" | "desc";
  /** Handler for page changes - updates URL */
  handlePageChange: (page: number) => void;
  /** Handler for column sort - updates URL, toggles direction if same column */
  handleSort: (column: string) => void;
  /** Raw search params for additional use */
  searchParams: ReturnType<typeof useSearchParams>;
}

/**
 * Custom hook để quản lý URL search params cho DataTable.
 * Xử lý phân trang và sắp xếp thông qua URL state.
 *
 * @example
 * ```tsx
 * const { page, sortBy, order, handlePageChange, handleSort } = useTableParams({
 *   defaultSortBy: "created_at",
 *   defaultOrder: "desc"
 * })
 *
 * return (
 *   <DataTable
 *     page={page}
 *     sortColumn={sortBy}
 *     sortDirection={order}
 *     onPageChange={handlePageChange}
 *     onSort={handleSort}
 *   />
 * )
 * ```
 */
export function useTableParams(
  options: UseTableParamsOptions = {}
): UseTableParamsReturn {
  const { defaultSortBy = "created_at", defaultOrder = "desc" } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoized values from URL
  const page = useMemo(
    () => Number(searchParams.get("page")) || 1,
    [searchParams]
  );

  const sortBy = useMemo(
    () => searchParams.get("sort_by") || defaultSortBy,
    [searchParams, defaultSortBy]
  );

  const order = useMemo(
    () => (searchParams.get("order") as "asc" | "desc") || defaultOrder,
    [searchParams, defaultOrder]
  );

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) =>
        params.set(key, String(value))
      );
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: newPage });
    },
    [updateParams]
  );

  // Sort handler - toggles direction if clicking same column
  const handleSort = useCallback(
    (column: string) => {
      const newOrder =
        sortBy === column ? (order === "asc" ? "desc" : "asc") : "asc";
      updateParams({
        sort_by: column,
        order: newOrder,
      });
    },
    [updateParams, sortBy, order]
  );

  return {
    page,
    sortBy,
    order,
    handlePageChange,
    handleSort,
    searchParams,
  };
}
