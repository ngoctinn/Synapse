import { z } from "zod";

import { ValidationMessages } from "@/shared/lib/validations";

export const warrantyStatusSchema = z.enum(["active", "expired", "voided", "claimed"]);

export const warrantyCreateSchema = z.object({
  customer_id: z.string().min(1, ValidationMessages.REQUIRED),
  treatment_id: z.string().min(1, ValidationMessages.REQUIRED),
  duration_months: z.coerce.number().min(1, "Thời hạn tối thiểu 1 tháng"),
  terms: z.string().min(10, "Điều khoản cần chi tiết hơn"),
});

export type WarrantyFormValues = z.infer<typeof warrantyCreateSchema>;
