"use client"

import { useCallback, useEffect, useState } from "react"
import { Shift } from "../model/types"

export interface UseGridPaintOptions {
  /** Whether paint mode is enabled */
  enabled: boolean
  /** Callback when a cell is painted */
  onPaint: (staffId: string, date: Date) => void
  /** Currently selected tool (shift or eraser) */
  selectedTool: Shift | "eraser" | null
}

export interface UseGridPaintReturn {
  /** Whether user is currently dragging */
  isDragging: boolean
  /** Handler for mouse down on a cell */
  handleMouseDown: (staffId: string, date: Date) => void
  /** Handler for mouse enter on a cell */
  handleMouseEnter: (staffId: string, date: Date) => void
  /** Handler for mouse up (can be called globally) */
  handleMouseUp: () => void
}

/**
 * Hook for managing paint/drag behavior on the schedule grid
 * Tách logic drag state management từ component để giữ grid pure rendering
 */
export function useGridPaint({
  enabled,
  onPaint,
  selectedTool,
}: UseGridPaintOptions): UseGridPaintReturn {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(
    (staffId: string, date: Date) => {
      if (enabled && selectedTool) {
        setIsDragging(true)
        onPaint(staffId, date)
      }
    },
    [enabled, selectedTool, onPaint]
  )

  const handleMouseEnter = useCallback(
    (staffId: string, date: Date) => {
      if (isDragging && enabled && selectedTool) {
        onPaint(staffId, date)
      }
    },
    [isDragging, enabled, selectedTool, onPaint]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Global mouse up listener to catch release outside cells
  useEffect(() => {
    if (!enabled) return

    window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [enabled, handleMouseUp])

  return {
    isDragging,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
  }
}
