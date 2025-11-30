import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  phone: z.string().optional().or(z.literal('')).refine((val) => {
    if (!val) return true;
    return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(val);
  }, { message: "Số điện thoại không hợp lệ" }),
  email: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')).refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
  }, { message: "Ngày sinh không hợp lệ" }),
  avatarUrl: z.string().optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
