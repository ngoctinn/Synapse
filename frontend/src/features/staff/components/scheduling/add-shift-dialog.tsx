"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useState } from "react"
import { MOCK_SHIFTS } from "../../model/shifts"
import { Shift } from "../../model/types"
import { ShiftForm } from "./shift-form"

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

  const handleAddTemplate = (template: Shift) => {
    onAddShift({
      ...template,
      id: window.crypto.randomUUID(), // New ID for the instance
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <div className="p-6 pb-4 border-b bg-muted/10">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Thêm ca làm việc</DialogTitle>
            <DialogDescription>
                {staffName && dateStr ? `${staffName} - ${dateStr}` : "Chọn ca mẫu hoặc tạo ca tùy chỉnh."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="template">Ca mẫu</TabsTrigger>
                <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="mt-0">
                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                {MOCK_SHIFTS.map((shift) => (
                    <button
                    key={shift.id}
                    onClick={() => handleAddTemplate(shift)}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all group text-left relative overflow-hidden"
                    >
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1.5"
                        style={{ backgroundColor: shift.color }}
                    />
                    <div className="pl-3">
                        <span className="block font-semibold text-foreground">
                        {shift.name}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md ml-auto">
                        {shift.startTime} - {shift.endTime}
                    </span>
                    </button>
                ))}
                </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-0">
                <ShiftForm
                    onSuccess={(shift) => {
                        onAddShift(shift);
                        onOpenChange(false);
                    }}
                    onCancel={() => onOpenChange(false)}
                />
            </TabsContent>
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
