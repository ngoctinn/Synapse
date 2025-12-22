import { z } from "zod";

export const treatmentStatusSchema = z.enum(["active", "completed", "cancelled", "expired"]);

export const treatmentCreateSchema = z.object({
  customer_id: z.string().min(1, "Vui lòng chọn khách hàng"),
  package_id: z.string().min(1, "Vui lòng chọn gói dịch vụ"),
  start_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Ngày bắt đầu không hợp lệ"),
  notes: z.string().optional().nullable(),
});

export type TreatmentFormValues = z.infer<typeof treatmentCreateSchema>;
