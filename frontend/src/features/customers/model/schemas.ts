import {
    dateOfBirthOptional,
    emailOptional,
    fullNameRequired,
    phoneVNRequired,
} from "@/shared/lib/validations";
import { z } from "zod";

export const customerSchema = z.object({
  full_name: fullNameRequired,
  email: emailOptional,
  phone_number: phoneVNRequired,
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
  date_of_birth: dateOfBirthOptional,
  address: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medical_notes: z.string().optional().nullable(),
  preferred_staff_id: z.string().optional().nullable(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const customerUpdateSchema = customerSchema.extend({
  id: z.string().uuid(),
});

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>;
