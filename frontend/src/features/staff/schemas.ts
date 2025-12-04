import { z } from "zod"

export const staffFormSchema = z.object({
  // Account Tab (Read-only mostly)
  email: z.string().email({ message: "Email không hợp lệ" }),
  role: z.enum(["admin", "receptionist", "technician"]),

  // Profile Tab
  full_name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  title: z.string().min(2, { message: "Chức danh không được để trống" }),
  bio: z.string().optional(),
  color_code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "Mã màu không hợp lệ" }).optional(),
  commission_rate: z.number().min(0).max(100).optional(),
})

export type StaffFormValues = z.infer<typeof staffFormSchema>

export const inviteStaffSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  role: z.enum(["admin", "receptionist", "technician"]),
  full_name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  title: z.string().min(2, { message: "Chức danh không được để trống" }),
  bio: z.string().optional(),
  skill_ids: z.array(z.string()).optional(),
})

export const editStaffSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").optional().or(z.literal("")),
  role: z.enum(["admin", "receptionist", "technician"]),
})

export type EditStaffFormValues = z.infer<typeof editStaffSchema>
