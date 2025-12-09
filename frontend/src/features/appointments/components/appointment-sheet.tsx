"use client"

import { Loader2, Save, Send } from "lucide-react"
import * as React from "react"


import { Appointment, Customer, Resource } from "@/features/appointments/types"
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

import { Service } from "@/features/services/types"
import { manageAppointment } from "../actions"

const initialState = {
  success: false,
  message: "",
  error: "",
}

interface AppointmentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "update"
  appointment?: Appointment | null
  defaultDate?: Date
  defaultResourceId?: string
  onSubmit?: (data: any) => void
  services: Service[]
  customers: Customer[]
  resources: Resource[]
}

export function AppointmentSheet({
    open,
    onOpenChange,
    mode,
    appointment,
    defaultDate,
    defaultResourceId,
    onSubmit,
    services,
    customers,
    resources
}: AppointmentSheetProps) {
  const [state, dispatch, isPending] = React.useActionState(manageAppointment, initialState)

  const handleSheetSubmit = (data: any) => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
          if (value instanceof Date) {
              formData.append(key, value.toISOString())
          } else if (value !== undefined && value !== null) {
              formData.append(key, String(value))
          }
      })

      React.startTransition(() => {
          dispatch(formData)
      })
  }

  React.useEffect(() => {
      if (state.success && state.data) {
          showToast.success(state.message || "Thành công")
          if (onSubmit) {
              onSubmit(state.data)
          }
          onOpenChange(false)
      } else if (state.error) {
          showToast.error("Thất bại", state.error)
      }
  }, [state, onSubmit, onOpenChange])

  const title = mode === "create" ? "Tạo lịch hẹn mới" : "Cập nhật lịch hẹn"
  const description = mode === "create"
    ? "Điền thông tin chi tiết để đặt lịch hẹn mới cho khách hàng."
    : "Chỉnh sửa thông tin lịch hẹn, thời gian hoặc dịch vụ."

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b space-y-1">
            <SheetTitle className="text-xl font-semibold text-foreground">
                {title}
            </SheetTitle>
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
                services={services || []}
                customers={customers || []}
                resources={resources || []}
                onSuccess={handleSheetSubmit}
                onCancel={() => onOpenChange(false)}
            />
        </div>

        <SheetFooter className="px-6 py-4 border-t sm:justify-end gap-3 bg-background">
            <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
            >
                Hủy bỏ
            </Button>
            <Button
                type="submit"
                form="appointment-form"
                disabled={isPending}
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
