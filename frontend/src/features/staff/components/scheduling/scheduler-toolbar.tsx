"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSchedulerTools } from "../../hooks/use-scheduler-tools"
import { SCHEDULER_UI, STAFF_HEADER_OFFSET_CLASS } from "../../model/constants"
// import { CopyWeekButton } from "./copy-week-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"
import { HelpCircle } from "lucide-react"
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
    <div className={cn("flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-4 py-3 border-b shrink-0 sticky z-50 bg-background shadow-xs", STAFF_HEADER_OFFSET_CLASS)}>
      {/* Group 1: Navigation */}
      <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border">
        <Button variant="ghost" size="icon" onClick={onPrevWeek} className="h-7 w-7" aria-label={SCHEDULER_UI.PREV_WEEK}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium w-[140px] text-center tabular-nums">
          {format(weekStart, "dd/MM")} - {format(weekEnd, "dd/MM/yyyy")}
        </div>
        <Button variant="ghost" size="icon" onClick={onNextWeek} className="h-7 w-7" aria-label={SCHEDULER_UI.NEXT_WEEK}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={onResetToday} className="h-7 text-xs px-2">
          {SCHEDULER_UI.TODAY}
        </Button>
      </div>

      <div className="flex items-center gap-4 ml-auto xl:ml-0">
        {/* Group 2: Tools */}
        <div className="flex items-center gap-2">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
               </TooltipTrigger>
               <TooltipContent>
                 <p>Chọn loại ca làm việc và click vào ô lịch để xếp ca</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
           <SchedulerPaintTools toolState={toolState} />
        </div>

        {/* Group 3: Actions */}
        {isDirty && (
             <div className="flex items-center gap-2 pl-4 border-l">
                {isDirty && (
                  <>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block mr-2">
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
                      className="h-8 text-xs bg-primary text-primary-foreground min-w-[80px]"
                    >
                      {isPending ? SCHEDULER_UI.SAVING : SCHEDULER_UI.SAVE}
                    </Button>
                  </>
                )}

                {/* Dead feature hidden temporarily */}
                {/* <CopyWeekButton onCopy={onCopyWeek} /> */}
             </div>
        )}
      </div>
    </div>
  )
}
