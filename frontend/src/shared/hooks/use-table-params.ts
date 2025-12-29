"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
 */
export function useTableParams(
  options: UseTableParamsOptions = {}
): UseTableParamsReturn {
  const { defaultSortBy = "created_at", defaultOrder = "desc" } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Values from URL
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort_by") || defaultSortBy;
  const order = (searchParams.get("order") as "asc" | "desc") || defaultOrder;

  // Update URL with new params
  const updateParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      params.set(key, String(value))
    );
    router.push(`${pathname}?${params.toString()}`);
  };

  // Page change handler
  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  // Sort handler - toggles direction if clicking same column
  const handleSort = (column: string) => {
    const newOrder =
      sortBy === column ? (order === "asc" ? "desc" : "asc") : "asc";
    updateParams({
      sort_by: column,
      order: newOrder,
    });
  };

  return {
    page,
    sortBy,
    order,
    handlePageChange,
    handleSort,
    searchParams,
  };
}
