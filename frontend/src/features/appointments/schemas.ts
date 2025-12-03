import { z } from "zod"

export const appointmentSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng"),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  staffId: z.string().min(1, "Vui lòng chọn nhân viên"),
  date: z.date({ message: "Vui lòng chọn ngày" }),
  startTime: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
  notes: z.string().optional(),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
