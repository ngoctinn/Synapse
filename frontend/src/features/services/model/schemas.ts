import { colorHexWithDefault } from "@/shared/lib/validations";
import * as z from "zod";

// Schema cho việc sử dụng thiết bị với timeline offset
export const equipmentUsageSchema = z.object({
  equipment_id: z.string().min(1, "Phải chọn thiết bị"),
  start_delay: z.coerce.number().min(0, "Độ trễ không được âm").default(0),
  usage_duration: z.coerce
    .number()
    .min(5, "Thời lượng sử dụng tối thiểu 5 phút")
    .default(15),
});

export const serviceSchema = z
  .object({
    name: z.string().min(1, "Tên dịch vụ là bắt buộc"),
    duration: z.coerce
      .number()
      .min(15, "Thời lượng tối thiểu 15 phút")
      .refine(
        (val) => val % 15 === 0,
        "Thời lượng phải là bội số của 15 (VD: 15, 30, 45...)"
      ),
    buffer_time: z.coerce
      .number()
      .min(0, "Thời gian nghỉ không được âm")
      .refine((val) => val % 15 === 0, "Thời gian nghỉ phải là bội số của 15"),
    price: z.coerce.number().min(0, "Giá không được âm"),
    is_active: z.boolean().default(true),
    image_url: z.string().optional(),
    color: colorHexWithDefault("#3b82f6"),
    description: z.string().optional(),
    category_id: z.string().min(1, "Vui lòng chọn danh mục").optional(),
    resource_requirements: z
      .object({
        bed_type_id: z.string().min(1, "Vui lòng chọn loại giường"),
        // Mặc định giường bận suốt thời lượng dịch vụ, nhưng schema hỗ trợ timeline
        bed_usage: z
          .object({
            start_delay: z.number().default(0),
            usage_duration: z.number().optional(), // Nếu null thì dùng duration dịch vụ
          })
          .optional(),
        equipment_usage: z.array(equipmentUsageSchema).default([]),
      })
      .default({ bed_type_id: "", equipment_usage: [] }),
    skill_ids: z.array(z.string()).default([]),
    new_skills: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    // A4: Validate equipment timeline không vượt quá service duration
    data.resource_requirements.equipment_usage.forEach((eq, index) => {
      const endTime = eq.start_delay + eq.usage_duration;
      if (endTime > data.duration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Thiết bị #${index + 1}: Thời gian sử dụng (${eq.start_delay}p + ${eq.usage_duration}p = ${endTime}p) vượt quá thời lượng dịch vụ (${data.duration}p)`,
          path: ["resource_requirements", "equipment_usage", index],
        });
      }
    });

    // Validate bed usage timeline if exists
    if (data.resource_requirements.bed_usage) {
      const bed = data.resource_requirements.bed_usage;
      const duration = bed.usage_duration ?? data.duration;
      if (bed.start_delay + duration > data.duration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Thời gian sử dụng giường vượt quá thời lượng dịch vụ",
          path: ["resource_requirements", "bed_usage"],
        });
      }
    }

    // A2: Validate bed_type_id bắt buộc
    if (!data.resource_requirements.bed_type_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn loại giường cho dịch vụ",
        path: ["resource_requirements", "bed_type_id"],
      });
    }
  });

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const skillSchema = z.object({
  name: z.string().min(1, "Tên kỹ năng là bắt buộc"),
  code: z
    .string()
    .min(1, "Mã kỹ năng là bắt buộc")
    .regex(/^[A-Z0-9_]+$/, "Mã chỉ được chứa chữ hoa, số và dấu gạch dưới"),
  description: z.string().optional().nullable(),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
