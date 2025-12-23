import {
  emailRequired,
  fullNameRequired,
  passwordRequired,
  ValidationMessages,
} from "@/shared/lib/validations";
import { z } from "zod";

export const loginSchema = z.object({
  email: emailRequired,
  password: passwordRequired,
});

export const registerSchema = z
  .object({
    fullName: fullNameRequired,
    email: emailRequired,
    password: passwordRequired,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ValidationMessages.PASSWORD_CONFIRM_MISMATCH,
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailRequired,
});

export const updatePasswordSchema = z
  .object({
    password: passwordRequired,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ValidationMessages.PASSWORD_CONFIRM_MISMATCH,
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
