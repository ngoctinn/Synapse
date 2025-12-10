"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSchedulerTools } from "../../hooks/use-scheduler-tools"
import { SCHEDULER_UI, STAFF_HEADER_OFFSET_CLASS } from "../../model/constants"
import { CopyWeekButton } from "./copy-week-button"
import { SchedulerPaintTools } from "./scheduler-paint-tools"

interface SchedulerToolbarProps {
  weekStart: Date
  weekEnd: Date
  isDirty: boolean
  isPending: boolean
  onPrevWeek: () => void
  onNextWeek: () => void
  onResetToday: () => void
  onCancelChanges: () => void
  onSaveChanges: () => void
  onCopyWeek: () => void
  toolState: ReturnType<typeof useSchedulerTools>
}

export function SchedulerToolbar({
  weekStart,
  weekEnd,
  isDirty,
  isPending,
  onPrevWeek,
  onNextWeek,
  onResetToday,
  onCancelChanges,
  onSaveChanges,
  onCopyWeek,
  toolState
}: SchedulerToolbarProps) {
  return (
    <div className={cn("flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-4 py-3 border-b shrink-0 sticky z-50 bg-background", STAFF_HEADER_OFFSET_CLASS)}>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevWeek} className="h-8 w-8 active:scale-95 transition-transform" aria-label={SCHEDULER_UI.PREV_WEEK}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium w-[180px] text-center">
          {format(weekStart, "dd/MM")} - {format(weekEnd, "dd/MM/yyyy")}
        </div>
        <Button variant="outline" size="icon" onClick={onNextWeek} className="h-8 w-8 active:scale-95 transition-transform" aria-label={SCHEDULER_UI.NEXT_WEEK}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onResetToday} className="h-8 text-xs active:scale-95 transition-transform">
          {SCHEDULER_UI.TODAY}
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-auto xl:ml-0">
        {/* Unsaved Changes Toolbar */}
        {isDirty && (
          <div className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              {SCHEDULER_UI.UNSAVED_CHANGES}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelChanges}
              disabled={isPending}
              className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
            >
              {SCHEDULER_UI.CANCEL}
            </Button>
            <Button
              size="sm"
              onClick={onSaveChanges}
              disabled={isPending}
              className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 min-w-[80px]"
            >
              {isPending ? SCHEDULER_UI.SAVING : SCHEDULER_UI.SAVE}
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
          </div>
        )}

        <SchedulerPaintTools toolState={toolState} />

        <div className="w-px h-4 bg-border mx-1" />

        <CopyWeekButton onCopy={onCopyWeek} />
      </div>
    </div>
  )
}
