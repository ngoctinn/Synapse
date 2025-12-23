import {
  dateOfBirthOptionalNonNull,
  emailOptional,
  fullNameRequired,
  phoneVNOptional,
} from "@/shared/lib/validations";
import { z } from "zod";

export const profileSchema = z.object({
  fullName: fullNameRequired,
  phone: phoneVNOptional,
  email: emailOptional,
  address: z.string().optional().or(z.literal("")),
  dateOfBirth: dateOfBirthOptionalNonNull,
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
