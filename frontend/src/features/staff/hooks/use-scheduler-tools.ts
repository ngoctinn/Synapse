"use client"

import { useState } from "react"
import { Shift } from "../model/types"

export function useSchedulerTools() {
  const [selectedTool, setSelectedTool] = useState<Shift | "eraser" | null>(null)
  const [isPaintOpen, setIsPaintOpen] = useState(false)

  const toggleTool = (tool: Shift | "eraser") => {
    setSelectedTool(current => (current === tool ? null : tool))
    setIsPaintOpen(false)
  }

  const clearTool = () => {
    setSelectedTool(null)
    setIsPaintOpen(false)
  }

  return {
    selectedTool,
    setSelectedTool,
    isPaintOpen,
    setIsPaintOpen,
    toggleTool,
    clearTool
  }
}
