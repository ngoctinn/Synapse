"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Clock } from "lucide-react"
import * as React from "react"

interface TimePickerProps {
  value?: string // Format "HH:mm"
  onChange: (value: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hour, setHour] = React.useState<string>("09")
  const [minute, setMinute] = React.useState<string>("00")

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      if (h && m) {
        setHour(h)
        setMinute(m)
      }
    }
  }, [value])

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")) // 5-minute steps

  const handleTimeChange = (newHour: string, newMinute: string) => {
    setHour(newHour)
    setMinute(newMinute)
    onChange(`${newHour}:${newMinute}`)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : <span>Chọn giờ</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-center">Giờ</Label>
            <ScrollArea className="h-48 w-16 border rounded-md">
              <div className="p-1">
                {hours.map((h) => (
                  <div
                    key={h}
                    className={cn(
                      "cursor-pointer px-2 py-1 text-center text-sm rounded hover:bg-slate-100",
                      hour === h && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                    onClick={() => handleTimeChange(h, minute)}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-center">Phút</Label>
            <ScrollArea className="h-48 w-16 border rounded-md">
              <div className="p-1">
                {minutes.map((m) => (
                  <div
                    key={m}
                    className={cn(
                      "cursor-pointer px-2 py-1 text-center text-sm rounded hover:bg-slate-100",
                      minute === m && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                    onClick={() => handleTimeChange(hour, m)}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
