import {
    emailOptional,
    fullNameRequired,
    phoneVNRequired,
} from "@/shared/lib/validations";
import { z } from "zod";

export const customerInfoSchema = z.object({
  full_name: fullNameRequired,
  phone_number: phoneVNRequired,
  email: emailOptional,
  notes: z.string().optional(),
});

export type CustomerInfoSchema = z.infer<typeof customerInfoSchema>;

export const bookingConfirmationSchema = z.object({
  holdId: z.string().uuid(),
  customerInfo: customerInfoSchema,
  paymentMethod: z.enum(["COD", "ONLINE"]),
});
