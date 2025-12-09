"use client"

import { CalendarPlus, Loader2, Save, Send } from "lucide-react"
import * as React from "react"


import { Appointment } from "@/features/appointments/types"
import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/shared/ui/sheet"
import { AppointmentForm } from "./appointment-form"

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



  const handleSheetSubmit = async (data: any) => {
      startTransition(async () => {
          try {

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
                form="appointment-form"
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
