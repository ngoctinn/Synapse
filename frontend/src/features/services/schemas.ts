import * as z from "zod";

// Schema cho việc sử dụng thiết bị với timeline offset
export const equipmentUsageSchema = z.object({
  equipment_id: z.string().min(1, "Phải chọn thiết bị"),
  start_offset: z.coerce.number()
    .min(0, "Thời điểm bắt đầu không được âm")
    .default(0),
  duration: z.coerce.number()
    .min(5, "Thời lượng sử dụng tối thiểu 5 phút")
    .default(15),
});

export type EquipmentUsage = z.infer<typeof equipmentUsageSchema>;

export const serviceSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ là bắt buộc"),
  duration: z.coerce.number()
    .min(15, "Thời lượng tối thiểu 15 phút")
    .refine((val) => val % 15 === 0, "Thời lượng phải là bội số của 15 (VD: 15, 30, 45...)"),
  buffer_time: z.coerce.number()
    .min(0, "Thời gian nghỉ không được âm")
    .refine((val) => val % 15 === 0, "Thời gian nghỉ phải là bội số của 15"),
  price: z.coerce.number().min(0, "Giá không được âm"),
  is_active: z.boolean().default(true),
  image_url: z.string().optional(),
  color: z.string().regex(/^#/, "Mã màu không hợp lệ").default("#3b82f6"),
  description: z.string().optional(),
  resource_requirements: z.object({
    room_type_id: z.string().optional(),
    equipment_ids: z.array(z.string()).default([]), // Legacy: backward compatible
    equipment_usage: z.array(equipmentUsageSchema).default([]), // New: timeline-based
  }).default({ equipment_ids: [], equipment_usage: [] }),
  skill_ids: z.array(z.string()).default([]),
  new_skills: z.array(z.string()).default([]),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const skillSchema = z.object({
  name: z.string().min(1, "Tên kỹ năng là bắt buộc"),
  code: z.string().min(1, "Mã kỹ năng là bắt buộc").regex(/^[A-Z0-9_]+$/, "Mã chỉ được chứa chữ hoa, số và dấu gạch dưới"),
  description: z.string().optional().nullable(),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
