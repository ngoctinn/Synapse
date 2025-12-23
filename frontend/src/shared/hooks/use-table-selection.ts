"use client";

import { useCallback, useMemo, useState } from "react";

type SelectableId = string | number;

interface UseTableSelectionOptions<T> {
  /** Hàm trích xuất ID từ item */
  keyExtractor: (item: T) => SelectableId;
  /** Data hiện tại để tính toán select all */
  data: T[];
}

interface UseTableSelectionReturn {
  /** Set các IDs đã được chọn */
  selectedIds: Set<SelectableId>;
  /** Toggle selection của một item */
  toggleOne: (id: SelectableId) => void;
  /** Toggle select all/deselect all */
  toggleAll: () => void;
  /** Xóa tất cả selection */
  clearAll: () => void;
  /** Kiểm tra item có được chọn không */
  isSelected: (id: SelectableId) => boolean;
  /** Kiểm tra có đang chọn tất cả không */
  isAllSelected: boolean;
  /** Kiểm tra có đang chọn một số (indeterminate) */
  isPartiallySelected: boolean;
  /** Số lượng đã chọn */
  selectedCount: number;
}

/**
 * Hook quản lý selection state cho table
 *
 * @example
 * ```tsx
 * const { selectedIds, toggleOne, toggleAll, isSelected, clearAll } = useTableSelection({
 *   data: resources,
 *   keyExtractor: (r) => r.id,
 * });
 * ```
 */
export function useTableSelection<T>({
  keyExtractor,
  data,
}: UseTableSelectionOptions<T>): UseTableSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<SelectableId>>(new Set());

  const toggleOne = useCallback((id: SelectableId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allIds = data.map(keyExtractor);
      const allSelected = allIds.every((id) => prev.has(id));

      if (allSelected) {
        return new Set();
      } else {
        return new Set(allIds);
      }
    });
  }, [data, keyExtractor]);

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: SelectableId) => selectedIds.has(id),
    [selectedIds]
  );

  const allIds = useMemo(() => data.map(keyExtractor), [data, keyExtractor]);

  const isAllSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selectedIds.has(id)),
    [allIds, selectedIds]
  );

  const isPartiallySelected = useMemo(
    () => selectedIds.size > 0 && !isAllSelected,
    [selectedIds.size, isAllSelected]
  );

  const selectedCount = selectedIds.size;

  return {
    selectedIds,
    toggleOne,
    toggleAll,
    clearAll,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    selectedCount,
  };
}
