"use client";

import { z } from "zod";

/**
 * Schema cho Customer Booking Form (Multi-Step Wizard)
 */
export const bookingSchema = z.object({
  // Step 1: Chọn dịch vụ
  service_id: z.string().min(1, "Vui lòng chọn dịch vụ"),

  // Step 2: Chọn ngày giờ
  date: z.date({
    message: "Vui lòng chọn ngày",
  }),
  time_slot: z.string().min(1, "Vui lòng chọn khung giờ"),

  // Step 2: Chọn KTV (optional)
  technician_id: z.string().optional(),

  // Step 3: Ghi chú
  notes: z.string().max(500, "Ghi chú không quá 500 ký tự").optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

/**
 * Schema cho từng step (partial validation)
 */
export const bookingStep1Schema = bookingSchema.pick({ service_id: true });
export const bookingStep2Schema = bookingSchema.pick({
  date: true,
  time_slot: true,
  technician_id: true,
});
export const bookingStep3Schema = bookingSchema.pick({ notes: true });

/**
 * Mock Services cho demo
 */
export interface BookingService {
  id: string;
  name: string;
  duration: number; // phút
  price: number;
  image_url?: string;
  description?: string;
}

export interface BookingTechnician {
  id: string;
  name: string;
  avatar_url?: string;
  title?: string;
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
}
