import { z } from "zod"

export const customerSchema = z.object({
  full_name: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone_number: z.string().min(10, "Số điện thoại ít nhất 10 số").max(15, "Số điện thoại quá dài"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medical_notes: z.string().optional().nullable(),
  preferred_staff_id: z.string().optional().nullable(),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

export const customerUpdateSchema = customerSchema.extend({
  user_id: z.string().uuid(),
})

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>
