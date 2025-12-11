/**
 * Schemas - Module Quản lý Lịch hẹn
 *
 * Zod validation schemas cho forms và API requests.
 * Sử dụng Zod v4 syntax.
 */

import { z } from "zod";

// ============================================
// FORM SCHEMAS
// ============================================

/** Schema cho form tạo/sửa cuộc hẹn */
export const appointmentFormSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng"),

  serviceIds: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một dịch vụ"),

  staffId: z.string().min(1, "Vui lòng chọn kỹ thuật viên"),

  resourceId: z.string().optional(),

  date: z.date({ message: "Ngày không hợp lệ" }),

  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ không hợp lệ (HH:mm)"),

  notes: z
    .string()
    .max(500, "Ghi chú tối đa 500 ký tự")
    .optional(),

  isRecurring: z.boolean().default(false),

  recurrence: z
    .object({
      frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
      interval: z
        .number()
        .int()
        .min(1, "Khoảng cách phải >= 1")
        .max(99, "Khoảng cách tối đa 99"),
      byDay: z.array(z.number().min(0).max(6)).optional(),
      endType: z.enum(["never", "count", "until"]),
      count: z.number().int().min(1).max(365).optional(),
      until: z.date().optional(),
    })
    .optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

/** Schema cho form chỉnh sửa nhanh (khi drag-drop) */
export const updateAppointmentTimeSchema = z.object({
  id: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
});

export type UpdateAppointmentTimeValues = z.infer<typeof updateAppointmentTimeSchema>;

// ============================================
// FILTER SCHEMAS
// ============================================

/** Schema cho bộ lọc lịch hẹn */
export const appointmentFilterSchema = z.object({
  staffIds: z.array(z.string()).default([]),
  serviceIds: z.array(z.string()).default([]),
  resourceIds: z.array(z.string()).default([]),
  statuses: z
    .array(
      z.enum([
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ])
    )
    .default([]),
  searchQuery: z.string().default(""),
});

export type AppointmentFilterValues = z.infer<typeof appointmentFilterSchema>;

// ============================================
// RECURRENCE SCHEMA (Riêng biệt)
// ============================================

/** Schema cho cấu hình lịch lặp lại */
export const recurrenceSchema = z
  .object({
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
    interval: z.number().int().min(1).max(99),
    byDay: z.array(z.number().min(0).max(6)).optional(),
    endType: z.enum(["never", "count", "until"]),
    count: z.number().int().min(1).max(365).optional(),
    until: z.date().optional(),
  })
  .refine(
    (data) => {
      // Nếu endType là 'count', phải có count
      if (data.endType === "count" && !data.count) {
        return false;
      }
      // Nếu endType là 'until', phải có until
      if (data.endType === "until" && !data.until) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng điền thông tin kết thúc phù hợp",
    }
  );

export type RecurrenceValues = z.infer<typeof recurrenceSchema>;

// ============================================
// API REQUEST SCHEMAS
// ============================================

/** Schema cho request tạo appointment (gửi lên API) */
export const createAppointmentRequestSchema = z.object({
  customer_id: z.string(),
  service_ids: z.array(z.string()),
  staff_id: z.string(),
  resource_id: z.string().optional(),
  start_time: z.string(), // ISO datetime
  end_time: z.string(), // ISO datetime
  notes: z.string().optional(),
  is_recurring: z.boolean(),
  recurrence_rule: z.string().optional(),
});

export type CreateAppointmentRequest = z.infer<typeof createAppointmentRequestSchema>;

/** Schema cho request cập nhật appointment */
export const updateAppointmentRequestSchema = createAppointmentRequestSchema.partial();

export type UpdateAppointmentRequest = z.infer<typeof updateAppointmentRequestSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate thời gian cuộc hẹn không ở quá khứ
 */
export function validateFutureDateTime(date: Date, time: string): boolean {
  const [hours, minutes] = time.split(":").map(Number);
  const appointmentDateTime = new Date(date);
  appointmentDateTime.setHours(hours, minutes, 0, 0);

  return appointmentDateTime > new Date();
}

/**
 * Validate thời gian nằm trong giờ làm việc
 */
export function validateWorkingHours(
  time: string,
  startHour: number = 8,
  endHour: number = 21
): boolean {
  const [hours] = time.split(":").map(Number);
  return hours >= startHour && hours < endHour;
}

/**
 * Parse time string thành { hours, minutes }
 */
export function parseTimeString(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}
