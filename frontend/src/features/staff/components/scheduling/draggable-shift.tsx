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
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm cursor-grab active:cursor-grabbing border text-xs font-medium transition-all hover:shadow-md bg-white group shrink-0",
        shift.type === "OFF" ? "bg-muted/50 border-dashed" : "border-l-4"
      )}
      style={{
        ...style,
        borderLeftColor: shift.type !== "OFF" ? shift.color : undefined
      }}
    >
      {shift.type !== "OFF" && (
        <div
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: shift.color }}
        />
      )}
      <span className="truncate max-w-[80px]">{shift.name}</span>
    </div>
  )
}
