"use client"

import { cn } from "@/shared/lib/utils"
import { useDraggable } from "@dnd-kit/core"
import { Shift } from "../../types"

interface DraggableShiftProps {
  shift: Shift
}

export function DraggableShift({ shift }: DraggableShiftProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `shift-source-${shift.id}`,
    data: {
      type: "shift",
      shift,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center justify-center p-3 rounded-md shadow-sm cursor-grab active:cursor-grabbing border text-sm font-medium transition-colors hover:shadow-md",
        shift.type === "OFF" ? "bg-muted text-muted-foreground border-dashed" : "bg-card text-card-foreground"
      )}
    >
      <div
        className="w-3 h-3 rounded-full mr-2"
        style={{ backgroundColor: shift.color }}
      />
      {shift.name}
      <span className="ml-auto text-xs text-muted-foreground">
        {shift.startTime} - {shift.endTime}
      </span>
    </div>
  )
}
