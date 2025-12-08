"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, Send, CalendarPlus } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Components
import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import { Form } from "@/shared/ui/form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/shared/ui/sheet"
import { AppointmentForm } from "./appointment-form"
import { Appointment } from "@/features/appointments/types"
import { format } from "date-fns"

// Since we are mocking, we will just simulate success after a timeout
const simulateServerAction = async (data: any) => {
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Thao tác thành công!" })
        }, 1000)
    })
}

interface AppointmentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "update"
  appointment?: Appointment | null
  defaultDate?: Date 
  defaultResourceId?: string
  onSubmit?: (data: any) => void
}

export function AppointmentSheet({ 
    open, 
    onOpenChange, 
    mode, 
    appointment, 
    defaultDate,
    defaultResourceId,
    onSubmit 
}: AppointmentSheetProps) {
  const [isPending, startTransition] = React.useTransition()

    // Using the same component for form logic but handling submit wrapper here
    // In a real app, we would lift the form state or use a specialized context
    // For now, we will pass a submit handler to the AppointmentForm
    
  // We need a ref to trigger form submit from the footer button
  // However, AppointmentForm is currently a controlled component that handles its own form
  // We will need to refactor AppointmentForm slightly or wrap it effectively.
  // For this step, let's create a wrapper that renders the form.
  
  // NOTE: Ideally AppointmentForm should expose its form methods or be a part of this component.
  // To avoid massive refactor of AppointmentForm's internal logic right now, we will
  // modify AppointmentForm to accept an external form ID or Ref, OR we just put the submit button inside the form.
  
  // Actually, looking at StaffSheet, the footer button is outside the form.
  // The form has an ID `staff-form` and the button has `form="staff-form"`.
  // We should apply the same pattern to AppointmentForm.

  const handleSheetSubmit = async (data: any) => {
      startTransition(async () => {
          try {
             // Simulate network request
             await simulateServerAction(data)
             
             if (onSubmit) {
                 onSubmit(data)
             }
             
             showToast.success(mode === "create" ? "Đã tạo lịch hẹn" : "Đã cập nhật lịch hẹn")
             onOpenChange(false)
          } catch (error) {
             showToast.error("Có lỗi xảy ra")
          }
      })
  }

  const title = mode === "create" ? "Tạo lịch hẹn mới" : "Cập nhật lịch hẹn"
  const description = mode === "create" 
    ? "Điền thông tin chi tiết để đặt lịch hẹn mới cho khách hàng." 
    : "Chỉnh sửa thông tin lịch hẹn, thời gian hoặc dịch vụ."

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5 text-primary" />
                    {title}
                </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground text-sm">
                {description}
            </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-gutter:stable]">
            {/* 
                We need to pass the submit handler downward. 
                But AppointmentForm defines its own form. 
                We will update AppointmentForm to accept an ID and an onSubmit prop that returns the data 
            */}
            <AppointmentForm 
                id="appointment-form"
                mode={mode}
                defaultDate={defaultDate}
                defaultResourceId={defaultResourceId}
                initialData={appointment}
                onSuccess={handleSheetSubmit}
                onCancel={() => onOpenChange(false)}
                isSheet={true} // New prop to toggle internal layout if needed
            />
        </div>

        <SheetFooter className="px-6 py-4 border-t sm:justify-between flex-row items-center gap-4 bg-background">
            <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground"
            >
                Hủy bỏ
            </Button>
            <Button
                type="submit"
                form="appointment-form" // This connects to the form ID inside AppointmentForm
                disabled={isPending}
                className="min-w-[140px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : mode === "create" ? (
                    <>
                        <Send className="mr-2 h-4 w-4" /> Tạo lịch hẹn
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                    </>
                )}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
