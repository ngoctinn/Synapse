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
    <div className={cn(
      "rounded-2xl border border-white/20 shadow-lg p-4 w-full max-w-md overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-black/40 dark:border-white/10 transition-all duration-300 hover:shadow-xl",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevDay}
          className="h-8 w-8 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center cursor-pointer group" onClick={goToToday}>
          <motion.span
            key={format(currentDate, "MM-yyyy")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-lg capitalize select-none tracking-tight text-foreground/90 group-hover:text-primary transition-colors"
          >
            {format(currentDate, "'Tháng' MM 'Năm' yyyy", { locale: vi })}
          </motion.span>
          {!isSameDay(currentDate, new Date()) && (
             <span className="text-[10px] text-muted-foreground font-medium group-hover:text-primary/80 transition-colors animate-in fade-in slide-in-from-top-1">
               Về hôm nay
             </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextDay}
          className="h-8 w-8 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative h-28 flex items-center justify-center">
        <div className="flex items-center justify-center gap-3 w-full perspective-[1000px]">
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
                  initial={{ scale: 0.8, opacity: 0, x: (index - 2) * 20 }}
                  animate={{
                    scale: isCenter ? 1.1 : 1 - (offset * 0.15),
                    opacity: isCenter ? 1 : 0.6 - (offset * 0.15),
                    y: isCenter ? 0 : offset * 5,
                    z: isCenter ? 0 : -offset * 20,
                    zIndex: isCenter ? 10 : 5 - offset,
                    filter: isCenter ? 'blur(0px)' : `blur(${offset * 1}px)`
                  }}
                  exit={{ scale: 0.8, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={cn(
                    "flex flex-col items-center justify-center w-14 h-20 rounded-2xl cursor-pointer select-none border relative transition-colors duration-300",
                    isCenter
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 border-primary/20"
                      : "bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border-transparent text-muted-foreground backdrop-blur-sm",
                    isToday && !isCenter && "text-primary font-semibold border-primary/30 bg-primary/5"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-medium capitalize tracking-wide mb-1",
                    isCenter ? "text-primary-foreground/90" : "text-muted-foreground"
                  )}>
                    {format(day, "EEE", { locale: vi })}
                  </span>
                  <span className={cn(
                    "text-xl font-bold flex items-center justify-center rounded-full w-8 h-8",
                    isCenter ? "bg-white/20" : "bg-transparent"
                  )}>
                    {format(day, "d")}
                  </span>
                  {isToday && !isCenter && (
                    <div className="w-1 h-1 rounded-full bg-primary absolute bottom-2 shadow-[0_0_4px_rgba(var(--primary),0.5)]" />
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
