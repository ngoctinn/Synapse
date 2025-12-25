import { colorHexWithDefault } from "@/shared/lib/validations";
import * as z from "zod";

export const serviceResourceRequirementSchema = z.object({
  group_id: z.string().min(1, "Vui lòng chọn tài nguyên"),
  quantity: z.coerce.number().min(1, "Số lượng tối thiểu 1").default(1),
  start_delay: z.coerce.number().min(0, "Thời gian bắt đầu không được âm").default(0),
  usage_duration: z.coerce.number().optional().nullable(),
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
    is_active: z.boolean().default(false),
    image_url: z.string().optional(),
    color: colorHexWithDefault("#3b82f6"),
    description: z.string().optional(),
    category_id: z.string().min(1, "Vui lòng chọn danh mục").optional(),
    resource_requirements: z
      .array(serviceResourceRequirementSchema)
      .default([]),
    skill_ids: z.array(z.string()).default([]),
    new_skills: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    // Validate resource requirement timelines
    data.resource_requirements.forEach((req, index) => {
       if (req.usage_duration) {
         const endTime = req.start_delay + req.usage_duration;
         if (endTime > data.duration) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Tài nguyên #${index + 1}: Thời gian sử dụng vượt quá thời lượng dịch vụ`,
              path: ["resource_requirements", index, "usage_duration"],
            });
         }
       }
    });
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
