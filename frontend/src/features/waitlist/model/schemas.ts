import { z } from "zod";

import {
    fullNameRequired,
    phoneVNRequired,
    ValidationMessages
} from "@/shared/lib/validations";

export const waitlistStatusSchema = z.enum(["pending", "notified", "converted", "cancelled", "expired"]);

export const waitlistCreateSchema = z.object({
  customer_id: z.string().optional(),
  customer_name: fullNameRequired,
  phone_number: phoneVNRequired,
  service_id: z.string().min(1, ValidationMessages.REQUIRED),
  preferred_date: z.string().refine((val) => !isNaN(Date.parse(val)), ValidationMessages.DOB_INVALID.replace("sinh", "mong muốn")),
  preferred_time_slot: z.string().min(1, ValidationMessages.REQUIRED),
  notes: z.string().optional().nullable(),
});

export type WaitlistFormValues = z.infer<typeof waitlistCreateSchema>;
