                                                      import { z } from "zod"

                                                      export const baseStaffSchema = z.object({
                                                        role: z.enum(["admin", "receptionist", "technician"]),
                                                        title: z.string().min(2, { message: "Chức danh phải có ít nhất 2 ký tự" }).optional(),
                                                        bio: z.string().optional(),
                                                        color_code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Mã màu không hợp lệ").optional(),
                                                        skill_ids: z.array(z.string()).optional(),
                                                      })

                                                      export const staffCreateSchema = baseStaffSchema.extend({
                                                        email: z.string().email({ message: "Email không hợp lệ" }),
                                                        full_name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
                                                        hired_at: z.string().optional(),
                                                        commission_rate: z.number().min(0).max(100).optional(),
                                                      })

                                                      export const staffUpdateSchema = baseStaffSchema.extend({
                                                        full_name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
                                                        phone_number: z.string().min(10, "Số điện thoại không hợp lệ").optional().or(z.literal("")),
                                                        hired_at: z.string().optional(),
                                                        commission_rate: z.number().min(0).max(100).optional(),
                                                      })

                                                      export type StaffCreateFormValues = z.infer<typeof staffCreateSchema>
export type StaffUpdateFormValues = z.infer<typeof staffUpdateSchema>

