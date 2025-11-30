"use client"

import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/ui/input"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

interface SegmentedDateInputProps {
  value?: Date
  onChange?: (date?: Date) => void
  className?: string
  disabled?: boolean
}

export function SegmentedDateInput({
  value,
  onChange,
  className,
  disabled,
}: SegmentedDateInputProps) {
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")

  const dayRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  // Sync state with prop value
  useEffect(() => {
    if (value) {
      setDay(value.getDate().toString().padStart(2, "0"))
      setMonth((value.getMonth() + 1).toString().padStart(2, "0"))
      setYear(value.getFullYear().toString())
    } else {
      setDay("")
      setMonth("")
      setYear("")
    }
  }, [value])

  const updateDate = (d: string, m: string, y: string) => {
    const dayNum = parseInt(d)
    const monthNum = parseInt(m)
    const yearNum = parseInt(y)

    if (
      d.length === 2 &&
      m.length === 2 &&
      y.length === 4 &&
      !isNaN(dayNum) &&
      !isNaN(monthNum) &&
      !isNaN(yearNum)
    ) {
      // Basic validation
      if (monthNum < 1 || monthNum > 12) return onChange?.(undefined)

      const maxDay = new Date(yearNum, monthNum, 0).getDate()
      if (dayNum < 1 || dayNum > maxDay) return onChange?.(undefined)

      // Valid date
      const newDate = new Date(yearNum, monthNum - 1, dayNum)
      onChange?.(newDate)
    } else {
      onChange?.(undefined)
    }
  }

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2)
    setDay(val)
    if (val.length === 2) monthRef.current?.focus()
    updateDate(val, month, year)
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2)
    setMonth(val)
    if (val.length === 2) yearRef.current?.focus()
    updateDate(day, val, year)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4)
    setYear(val)
    updateDate(day, month, val)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevRef: React.RefObject<HTMLInputElement | null>,
    currentValue: string
  ) => {
    if (e.key === "Backspace" && currentValue === "" && prevRef.current) {
      prevRef.current.focus()
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Input
          ref={dayRef}
          placeholder="DD"
          value={day}
          onChange={handleDayChange}
          onKeyDown={(e) => handleKeyDown(e, { current: null }, day)}
          className="w-12 text-center px-1"
          maxLength={2}
          disabled={disabled}
        />
        <span className="text-[10px] text-muted-foreground absolute -bottom-4 left-1/2 -translate-x-1/2">Ngày</span>
      </div>
      <span className="text-muted-foreground/50">/</span>
      <div className="relative">
        <Input
          ref={monthRef}
          placeholder="MM"
          value={month}
          onChange={handleMonthChange}
          onKeyDown={(e) => handleKeyDown(e, dayRef, month)}
          className="w-12 text-center px-1"
          maxLength={2}
          disabled={disabled}
        />
        <span className="text-[10px] text-muted-foreground absolute -bottom-4 left-1/2 -translate-x-1/2">Tháng</span>
      </div>
      <span className="text-muted-foreground/50">/</span>
      <div className="relative">
        <Input
          ref={yearRef}
          placeholder="YYYY"
          value={year}
          onChange={handleYearChange}
          onKeyDown={(e) => handleKeyDown(e, monthRef, year)}
          className="w-16 text-center px-1"
          maxLength={4}
          disabled={disabled}
        />
        <span className="text-[10px] text-muted-foreground absolute -bottom-4 left-1/2 -translate-x-1/2">Năm</span>
      </div>
    </div>
  )
}
