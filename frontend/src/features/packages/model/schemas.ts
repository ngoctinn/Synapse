import { z } from "zod";

export const packageServiceSchema = z.object({
  service_id: z.string().min(1, "Chọn dịch vụ"),
  quantity: z.coerce.number().min(1, "Số lượng tối thiểu là 1"),
});

export const packageSchema = z.object({
  name: z.string().min(1, "Tên gói không được để trống").max(100),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Giá không được âm"),
  validity_days: z.coerce.number().min(1, "Thời hạn tối thiểu 1 ngày"),
  is_active: z.boolean().default(true),
  services: z
    .array(packageServiceSchema)
    .min(1, "Gói phải có ít nhất 1 dịch vụ"),
});

export type PackageFormValues = z.infer<typeof packageSchema>;

export const packageUpdateSchema = packageSchema.extend({
  id: z.string().uuid(),
});

export type PackageUpdateFormValues = z.infer<typeof packageUpdateSchema>;
