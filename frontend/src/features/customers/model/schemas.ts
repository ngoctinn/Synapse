import { z } from "zod"

export const customerSchema = z.object({
  full_name: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone_number: z.string().min(10, "Số điện thoại ít nhất 10 số").max(15, "Số điện thoại quá dài"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
  date_of_birth: z.string().optional().nullable().refine((val) => {
    if (!val) return true
    const date = new Date(val)
    return !isNaN(date.getTime()) && date <= new Date()
  }, "Ngày sinh không được lớn hơn ngày hiện tại"),
  address: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medical_notes: z.string().optional().nullable(),
  preferred_staff_id: z.string().optional().nullable(),
  membership_tier: z.enum(["SILVER", "GOLD", "PLATINUM"]).optional().default("SILVER"),
  loyalty_points: z.coerce.number().min(0, "Điểm tích lũy không được âm").optional().default(0),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

export const customerUpdateSchema = customerSchema.extend({
  id: z.string().uuid(),
})

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>
