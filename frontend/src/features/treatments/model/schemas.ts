import { z } from "zod";

import { ValidationMessages } from "@/shared/lib/validations";

export const treatmentStatusSchema = z.enum([
  "active",
  "completed",
  "cancelled",
  "expired",
]);

export const treatmentCreateSchema = z.object({
  customer_id: z.string().min(1, ValidationMessages.REQUIRED),
  package_id: z.string().min(1, ValidationMessages.REQUIRED),
  start_date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      ValidationMessages.DOB_INVALID.replace("sinh", "bắt đầu")
    ),
  notes: z.string().optional().nullable(),
});

export type TreatmentFormValues = z.infer<typeof treatmentCreateSchema>;
