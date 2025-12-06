"use client"

import { Button } from "@/shared/ui/button"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import { TimeInput } from "@/shared/ui/custom/time-input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import { Label } from "@/shared/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Tag } from "lucide-react"
import { useState } from "react"
import { MOCK_SHIFTS } from "../../data/mock-shifts"
import { Shift } from "../../types"

interface AddShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddShift: (shift: Shift) => void
  staffName?: string
  dateStr?: string
}

export function AddShiftDialog({
  open,
  onOpenChange,
  onAddShift,
  staffName,
  dateStr,
}: AddShiftDialogProps) {
  const [activeTab, setActiveTab] = useState("template")

  // Custom shift state
  const [customName, setCustomName] = useState("")
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("17:00")
  const [color, setColor] = useState("#3b82f6") // Default blue

  const handleAddTemplate = (template: Shift) => {
    onAddShift({
      ...template,
      id: Math.random().toString(36).substr(2, 9), // New ID for the instance
    })
    onOpenChange(false)
  }

  const handleAddCustom = () => {
    if (!customName || !startTime || !endTime) return

    const newShift: Shift = {
      id: Math.random().toString(36).substr(2, 9),
      name: customName,
      startTime,
      endTime,
      color,
      type: "WORK", // Default to work type
    }
    onAddShift(newShift)
    onOpenChange(false)

    // Reset form
    setCustomName("")
    setStartTime("08:00")
    setEndTime("17:00")
    setColor("#3b82f6")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm ca làm việc</DialogTitle>
          {staffName && dateStr && (
            <div className="text-sm text-muted-foreground">
              {staffName} - {dateStr}
            </div>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">Ca mẫu</TabsTrigger>
            <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4 py-4">
            <div className="flex flex-col gap-3">
              {MOCK_SHIFTS.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => handleAddTemplate(shift)}
                  className="flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all hover:shadow-md hover:border-primary/50 bg-white group text-left"
                  style={{ borderLeftColor: shift.color, borderLeftWidth: "4px" }}
                >
                  <span className="truncate font-semibold text-foreground/90">
                    {shift.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal ml-2 shrink-0">
                    {shift.startTime} - {shift.endTime}
                  </span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên ca</Label>
              <InputWithIcon
                icon={Tag}
                placeholder="Ví dụ: Ca gãy, Tăng ca..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bắt đầu</Label>
                <TimeInput
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Kết thúc</Label>
                <TimeInput
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <div className="flex gap-2 flex-wrap">
                {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <Button onClick={handleAddCustom} className="w-full mt-2" disabled={!customName}>
              Thêm ca tùy chỉnh
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
