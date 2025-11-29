import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
