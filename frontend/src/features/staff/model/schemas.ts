import {
  colorHexOptional,
  emailRequired,
  fullNameRequired,
  phoneVNOptional,
} from "@/shared/lib/validations";
import { z } from "zod";

export const baseStaffSchema = z.object({
  role: z.enum(["admin", "receptionist", "technician"]),
  title: z
    .string()
    .min(2, { message: "Chức danh phải có ít nhất 2 ký tự" })
    .optional(),
  bio: z.string().optional(),
  color_code: colorHexOptional,
  skill_ids: z.array(z.string()).optional(),
});

export const staffCreateSchema = baseStaffSchema.extend({
  email: emailRequired,
  full_name: fullNameRequired,
  hired_at: z.string().optional(),
  commission_rate: z.number().min(0).max(100).optional(),
});

export const staffUpdateSchema = baseStaffSchema.extend({
  full_name: fullNameRequired,
  phone_number: phoneVNOptional,
  hired_at: z.string().optional(),
  commission_rate: z.number().min(0).max(100).optional(),
});

export type StaffCreateFormValues = z.infer<typeof staffCreateSchema>;
export type StaffUpdateFormValues = z.infer<typeof staffUpdateSchema>;
