import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(2, "Tên tài nguyên phải có ít nhất 2 ký tự"),
  code: z.string().min(2, "Mã tài nguyên phải có ít nhất 2 ký tự"),
  type: z.enum(["ROOM", "EQUIPMENT"]),
  status: z.enum(["ACTIVE", "MAINTENANCE", "INACTIVE"]),
  capacity: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
