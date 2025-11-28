import { z } from "zod"

export const staffFormSchema = z.object({
  // Account Tab
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }).optional().or(z.literal("")),
  role: z.enum(["ADMIN", "RECEPTIONIST", "TECHNICIAN"]),

  // Profile Tab
  // Profile Tab
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: "Số điện thoại không hợp lệ" }).optional().or(z.literal("")),
  address: z.string().optional(),
  skills: z.array(z.string()),
})

export type StaffFormValues = z.infer<typeof staffFormSchema>
