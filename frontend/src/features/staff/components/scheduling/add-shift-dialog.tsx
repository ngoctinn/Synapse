"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/ui/sheet"
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
      id: window.crypto.randomUUID(),
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-xl font-semibold">Thêm ca làm việc</SheetTitle>
          <SheetDescription>
            {staffName && dateStr ? `${staffName} - ${dateStr}` : "Chọn ca mẫu hoặc tạo ca tùy chỉnh."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/60 rounded-lg p-1 mb-6 h-11">
              <TabsTrigger value="template" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Ca mẫu</TabsTrigger>
              <TabsTrigger value="custom" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Tùy chỉnh</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="mt-0">
              <div className="flex flex-col gap-3">
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
      </SheetContent>
    </Sheet>
  )
}
