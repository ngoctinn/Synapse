"use client";

import { useCallback, useState } from "react";
import { SelectedSlot } from "../../../model/types";

/**
 * Hook quản lý selection mode cho batch operations
 */
export function useSelection() {
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => !prev);
    if (selectionMode) {
      // Clear selections when exiting selection mode
      setSelectedSlots([]);
    }
  }, [selectionMode]);

  // Enable selection mode
  const enableSelectionMode = useCallback(() => {
    setSelectionMode(true);
  }, []);

  // Disable selection mode and clear selections
  const disableSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedSlots([]);
  }, []);

  // Toggle a single slot
  const toggleSlot = useCallback((staffId: string, dateStr: string) => {
    setSelectedSlots((prev) => {
      const exists = prev.some(
        (s) => s.staffId === staffId && s.dateStr === dateStr
      );
      if (exists) {
        return prev.filter(
          (s) => !(s.staffId === staffId && s.dateStr === dateStr)
        );
      } else {
        return [...prev, { staffId, dateStr }];
      }
    });
  }, []);

  // Check if a slot is selected
  const isSlotSelected = useCallback(
    (staffId: string, dateStr: string) => {
      return selectedSlots.some(
        (s) => s.staffId === staffId && s.dateStr === dateStr
      );
    },
    [selectedSlots]
  );

  // Select all slots for a specific staff
  const selectAllForStaff = useCallback((staffId: string, dates: string[]) => {
    const newSlots: SelectedSlot[] = dates.map((dateStr) => ({
      staffId,
      dateStr,
    }));
    setSelectedSlots((prev) => {
      // Remove existing slots for this staff, then add all
      const filtered = prev.filter((s) => s.staffId !== staffId);
      return [...filtered, ...newSlots];
    });
  }, []);

  // Select all slots for a specific date
  const selectAllForDate = useCallback(
    (dateStr: string, staffIds: string[]) => {
      const newSlots: SelectedSlot[] = staffIds.map((staffId) => ({
        staffId,
        dateStr,
      }));
      setSelectedSlots((prev) => {
        // Remove existing slots for this date, then add all
        const filtered = prev.filter((s) => s.dateStr !== dateStr);
        return [...filtered, ...newSlots];
      });
    },
    []
  );

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedSlots([]);
  }, []);

  return {
    // State
    selectedSlots,
    selectionMode,
    selectedCount: selectedSlots.length,

    // Actions
    toggleSelectionMode,
    enableSelectionMode,
    disableSelectionMode,
    toggleSlot,
    isSlotSelected,
    selectAllForStaff,
    selectAllForDate,
    clearSelection,
  };
}
