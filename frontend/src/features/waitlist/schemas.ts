import { z } from "zod";

export const waitlistStatusSchema = z.enum(["pending", "notified", "converted", "cancelled", "expired"]);

export const waitlistCreateSchema = z.object({
  customer_id: z.string().optional(),
  customer_name: z.string().min(1, "Vui lòng nhập tên khách hàng"),
  phone_number: z.string().min(10, "Số điện thoại không hợp lệ"),
  service_id: z.string().min(1, "Vui lòng chọn dịch vụ quan tâm"),
  preferred_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Ngày mong muốn không hợp lệ"),
  preferred_time_slot: z.string().min(1, "Vui lòng chọn khung giờ"),
  notes: z.string().optional().nullable(),
});

export type WaitlistFormValues = z.infer<typeof waitlistCreateSchema>;
