"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { addDays, format, isSameDay, subDays } from "date-fns"
import { vi } from "date-fns/locale"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"

interface StripCalendarProps {
  date?: Date
  onDateChange?: (date: Date) => void
  className?: string
}

export function StripCalendar({ date, onDateChange, className }: StripCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(date || new Date())

  // Sync internal state if external date changes
  React.useEffect(() => {
    if (date) {
      setCurrentDate(date)
    }
  }, [date])

  const nextDay = () => {
    const newDate = addDays(currentDate, 1)
    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const prevDay = () => {
    const newDate = subDays(currentDate, 1)
    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    onDateChange?.(today)
  }

  // Generate 5 days centered on currentDate
  // [-2, -1, 0, 1, 2]
  const days = Array.from({ length: 5 }).map((_, i) => addDays(currentDate, i - 2))

  return (
    <div className={cn("bg-card rounded-xl border shadow-sm p-4 w-full max-w-md overflow-hidden", className)}>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={prevDay} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center cursor-pointer" onClick={goToToday}>
          <motion.span
            key={format(currentDate, "MM-yyyy")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-semibold text-base capitalize select-none"
          >
            {format(currentDate, "'Tháng' MM 'Năm' yyyy", { locale: vi })}
          </motion.span>
          {!isSameDay(currentDate, new Date()) && (
             <span className="text-[10px] text-muted-foreground font-medium hover:text-primary transition-colors">
               Về hôm nay
             </span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={nextDay} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative h-24 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {days.map((day, index) => {
              const isCenter = index === 2
              const isToday = isSameDay(day, new Date())
              const offset = Math.abs(index - 2)

              return (
                <motion.div
                  layout
                  key={day.toISOString()}
                  onClick={() => {
                    setCurrentDate(day)
                    onDateChange?.(day)
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isCenter ? 1.1 : 1 - (offset * 0.15),
                    opacity: isCenter ? 1 : 0.5 - (offset * 0.1),
                    y: isCenter ? 0 : offset * 5,
                    zIndex: isCenter ? 10 : 5 - offset
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={cn(
                    "flex flex-col items-center justify-center w-14 h-20 rounded-2xl cursor-pointer select-none border relative",
                    isCenter
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 border-primary"
                      : "bg-card hover:bg-accent border-transparent text-muted-foreground",
                    isToday && !isCenter && "text-primary font-semibold border-primary/30"
                  )}
                >
                  <span className={cn(
                    "text-[11px] font-medium capitalize",
                    isCenter ? "text-primary-foreground/90" : "text-muted-foreground"
                  )}>
                    {format(day, "EEE", { locale: vi })}
                  </span>
                  <span className={cn(
                    "text-xl font-bold flex items-center justify-center rounded-full",
                    isCenter ? "text-white" : "text-foreground"
                  )}>
                    {format(day, "d")}
                  </span>
                  {isToday && !isCenter && (
                    <div className="w-1 h-1 rounded-full bg-primary absolute bottom-2" />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
