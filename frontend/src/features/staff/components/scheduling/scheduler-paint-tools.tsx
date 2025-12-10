"use client"

import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { Eraser, Paintbrush, X } from "lucide-react"
import { useSchedulerTools } from "../../hooks/use-scheduler-tools"
import { SCHEDULER_UI } from "../../model/constants"
import { MOCK_SHIFTS } from "../../model/shifts"

interface SchedulerPaintToolsProps {
  toolState: ReturnType<typeof useSchedulerTools>
}

export function SchedulerPaintTools({ toolState }: SchedulerPaintToolsProps) {
  const {
    selectedTool,
    isPaintOpen,
    setIsPaintOpen,
    toggleTool,
    clearTool
  } = toolState

  return (
    <>
      <Popover open={isPaintOpen} onOpenChange={setIsPaintOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`
              h-8 gap-2 min-w-[140px] justify-between text-xs
              ${selectedTool ? "border-primary/50 bg-primary/5 text-primary" : "text-muted-foreground"}
            `}
          >
            <div className="flex items-center gap-2">
              <Paintbrush className="h-3.5 w-3.5" />
              <span className="font-medium">
                {selectedTool === "eraser"
                  ? SCHEDULER_UI.ERASING
                  : (typeof selectedTool === "object" && selectedTool !== null)
                    ? selectedTool.name
                    : SCHEDULER_UI.PAINT_MODE}
              </span>
            </div>
            {selectedTool && selectedTool !== "eraser" && (
              <span
                className="w-2 h-2 rounded-full ring-1 ring-offset-1"
                style={{ backgroundColor: selectedTool.color, borderColor: selectedTool.color }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              {SCHEDULER_UI.SELECT_TOOL_LABEL}
            </div>
            {MOCK_SHIFTS.map(shift => (
              <button
                key={shift.id}
                onClick={() => toggleTool(shift)}
                className={`
                  w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer
                  focus:ring-2 focus:ring-primary/50 focus:outline-none
                  ${selectedTool === shift
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground"}
                `}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: shift.color }}
                />
                {shift.name}
              </button>
            ))}
            <div className="h-px bg-border my-1" />
            <button
              onClick={() => toggleTool("eraser")}
              className={`
                w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer
                focus:ring-2 focus:ring-destructive/50 focus:outline-none
                ${selectedTool === "eraser"
                  ? "bg-destructive/10 text-destructive font-medium"
                  : "hover:bg-muted text-foreground"}
              `}
            >
              <Eraser className="h-4 w-4" />
              {SCHEDULER_UI.ERASER_TOOL}
            </button>
            {selectedTool && (
              <>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={clearTool}
                  className="w-full text-left px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {SCHEDULER_UI.TURN_OFF_PAINT}
                </button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedTool && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
          onClick={clearTool}
          aria-label={SCHEDULER_UI.TURN_OFF_PAINT}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {selectedTool && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border rounded-full shadow-lg p-1.5 pr-4 flex items-center gap-3 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground shadow-sm"
            style={{
              backgroundColor: typeof selectedTool === 'object' ? selectedTool.color : 'hsl(var(--destructive))'
            }}
          >
            {typeof selectedTool === 'object' ? <Paintbrush className="w-4 h-4" /> : <Eraser className="w-4 h-4" />}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {typeof selectedTool === 'object' ? `${SCHEDULER_UI.PAINT_MODE}: ${selectedTool.name}` : SCHEDULER_UI.ERASING}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {SCHEDULER_UI.DRAG_TIP}
            </span>
          </div>
          <div className="h-4 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTool}
            className="h-7 text-xs hover:bg-muted font-medium"
          >
            {SCHEDULER_UI.DONE}
          </Button>
        </div>
      )}
    </>
  )
}
