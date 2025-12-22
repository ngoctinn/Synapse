import { z } from "zod";

export const warrantyStatusSchema = z.enum(["active", "expired", "voided", "claimed"]);

export const warrantyCreateSchema = z.object({
  customer_id: z.string().min(1, "Vui lòng chọn khách hàng"),
  treatment_id: z.string().min(1, "Vui lòng chọn liệu trình"),
  duration_months: z.coerce.number().min(1, "Thời hạn tối thiểu 1 tháng"),
  terms: z.string().min(10, "Điều khoản cần chi tiết hơn"),
});

export type WarrantyFormValues = z.infer<typeof warrantyCreateSchema>;
