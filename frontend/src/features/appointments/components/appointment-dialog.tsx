"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { AppointmentForm } from "./appointment-form"
import { AppointmentFormValues } from "../schemas"

export function AppointmentDialog() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const action = searchParams.get("action")
  const id = searchParams.get("id")
  const dateParam = searchParams.get("date")
  const timeParam = searchParams.get("time")
  
  const isOpen = action === "create" || (action === "edit" && !!id) || (action === "view" && !!id)

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("action")
    params.delete("id")
    params.delete("date")
    params.delete("time")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleEdit = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("action", "edit")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSubmit = (values: AppointmentFormValues) => {
    console.log("Submit values:", values)
    // TODO: Call API to create/update
    handleClose()
  }

  const isEdit = action === "edit"
  const isView = action === "view"

  // Prepare default values for create mode if date/time are present
  const createDefaultValues = (dateParam || timeParam) ? {
    date: dateParam ? new Date(dateParam) : new Date(),
    startTime: timeParam || "09:00",
  } : undefined

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isView ? "Chi tiết lịch hẹn" : isEdit ? "Chỉnh sửa lịch hẹn" : "Tạo lịch hẹn mới"}
          </DialogTitle>
          <DialogDescription>
            {isView
              ? "Xem thông tin chi tiết lịch hẹn."
              : isEdit
              ? "Cập nhật thông tin lịch hẹn."
              : "Điền thông tin để tạo lịch hẹn mới."}
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm
          onSubmit={handleSubmit}
          onCancel={handleClose}
          readOnly={isView}
          onEdit={handleEdit}
          defaultValues={isEdit || isView ? {
            customerId: "1",
            serviceId: "1",
            staffId: "1",
            date: new Date(),
            startTime: "09:00",
            notes: "Khách hàng VIP",
          } : createDefaultValues}
        />
      </DialogContent>
    </Dialog>
  )
}
