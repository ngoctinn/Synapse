"use client"

import { Button } from "@/shared/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CalendarHeaderProps {
  currentDate: Date
  onNextWeek: () => void
  onPrevWeek: () => void
  onGoToToday: () => void
}

export function CalendarHeader({ 
  currentDate, 
  onNextWeek, 
  onPrevWeek, 
  onGoToToday 
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b sticky top-0 z-30 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" onClick={onPrevWeek} className="h-8 w-8 hover:bg-slate-100 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextWeek} className="h-8 w-8 hover:bg-slate-100 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold capitalize min-w-[200px]">
          {format(currentDate, "MMMM yyyy", { locale: vi })}
        </h2>
        <Button variant="ghost" size="sm" onClick={onGoToToday} className="text-muted-foreground hover:text-foreground">
          Hôm nay
        </Button>
      </div>
    </div>
  )
}
