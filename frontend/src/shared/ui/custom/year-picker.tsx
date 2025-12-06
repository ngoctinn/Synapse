"use client"

import * as React from "react"
import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { cn } from "@/shared/lib/utils"
import { getYear, setYear } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface YearPickerProps {
  date?: Date | undefined
  onSelect?: (date: Date) => void
  disabled?: boolean
  className?: string
}

export function YearPicker({
  date,
  onSelect,
  disabled,
  className,
}: YearPickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedYear = date ? getYear(date) : getYear(new Date())
  const [currentYearPage, setCurrentYearPage] = React.useState(selectedYear)

  // 12 years per page (3 cols x 4 rows)
  const startYear = Math.floor(currentYearPage / 12) * 12
  const years = Array.from({ length: 12 }, (_, i) => startYear + i)

  const handleYearSelect = (year: number) => {
    const dateToEmit = date ? setYear(date, year) : setYear(new Date(), year)
    onSelect?.(dateToEmit)
    setOpen(false)
  }

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentYearPage((prev) => prev - 12)
    } else {
      setCurrentYearPage((prev) => prev + 12)
    }
  }

  // Sync page with selected date when opening
  React.useEffect(() => {
    if (open) {
      setCurrentYearPage(selectedYear)
    }
  }, [open, selectedYear])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-center text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedYear}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="center">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold text-sm">
            {startYear} - {startYear + 11}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={year === selectedYear ? "default" : "ghost"}
              className={cn(
                "h-9 w-16 text-sm",
                year === getYear(new Date()) &&
                  year !== selectedYear &&
                  "text-primary font-semibold"
              )}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
