import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(2, "Tên tài nguyên phải có ít nhất 2 ký tự"),
  code: z.string().min(2, "Mã tài nguyên phải có ít nhất 2 ký tự"),
  groupId: z.string().min(1, "Vui lòng chọn nhóm tài nguyên"),
  type: z.enum(["ROOM", "EQUIPMENT"]),
  status: z.enum(["ACTIVE", "MAINTENANCE", "INACTIVE"]),
  capacity: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  setupTime: z.coerce
    .number()
    .min(0, "Thời gian chuẩn bị không được âm")
    .optional()
    .default(0),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
