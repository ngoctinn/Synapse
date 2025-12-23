import { z } from "zod";
import { ValidationMessages } from "./messages";

/**
 * Regex patterns chuẩn hóa
 */
export const PATTERNS = {
  // Số điện thoại Việt Nam: 0983123456 hoặc +84983123456
  VN_PHONE: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
  // Mã màu HEX: #FFF hoặc #FFFFFF
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
} as const;

/**
 * Constraints chuẩn hóa
 */
export const CONSTRAINTS = {
  FULL_NAME: { MIN: 2, MAX: 50 },
  PASSWORD: { MIN: 8 },
  DOB: { MIN_YEAR: 1900 },
} as const;

// ============================================================
// ATOMIC VALIDATORS (Building blocks)
// ============================================================

/**
 * Họ tên - Bắt buộc
 */
export const fullNameRequired = z
  .string()
  .min(CONSTRAINTS.FULL_NAME.MIN, ValidationMessages.FULL_NAME_MIN)
  .max(CONSTRAINTS.FULL_NAME.MAX, ValidationMessages.FULL_NAME_MAX);

/**
 * Họ tên - Tùy chọn
 */
export const fullNameOptional = z
  .string()
  .min(CONSTRAINTS.FULL_NAME.MIN, ValidationMessages.FULL_NAME_MIN)
  .max(CONSTRAINTS.FULL_NAME.MAX, ValidationMessages.FULL_NAME_MAX)
  .optional()
  .or(z.literal(""));

/**
 * Email - Bắt buộc
 */
export const emailRequired = z.string().email(ValidationMessages.EMAIL_INVALID);

/**
 * Email - Tùy chọn (cho phép empty string)
 */
export const emailOptional = z
  .string()
  .email(ValidationMessages.EMAIL_INVALID)
  .optional()
  .or(z.literal(""));

/**
 * Số điện thoại Việt Nam - Bắt buộc
 */
export const phoneVNRequired = z
  .string()
  .regex(PATTERNS.VN_PHONE, ValidationMessages.PHONE_INVALID);

/**
 * Số điện thoại Việt Nam - Tùy chọn
 */
export const phoneVNOptional = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine(
    (val) => !val || PATTERNS.VN_PHONE.test(val),
    ValidationMessages.PHONE_INVALID
  );

/**
 * Ngày sinh - Tùy chọn
 * Validate: năm >= 1900 và không vượt quá ngày hiện tại
 */
export const dateOfBirthOptional = z
  .string()
  .optional()
  .nullable()
  .refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    const year = date.getFullYear();
    return (
      !isNaN(date.getTime()) &&
      year >= CONSTRAINTS.DOB.MIN_YEAR &&
      date <= new Date()
    );
  }, ValidationMessages.DOB_INVALID);

/**
 * Ngày sinh - Tùy chọn (không chấp nhận null)
 * Dùng cho các interface chỉ accept string | undefined
 */
export const dateOfBirthOptionalNonNull = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    const year = date.getFullYear();
    return (
      !isNaN(date.getTime()) &&
      year >= CONSTRAINTS.DOB.MIN_YEAR &&
      date <= new Date()
    );
  }, ValidationMessages.DOB_INVALID);

/**
 * Mật khẩu - Bắt buộc
 */
export const passwordRequired = z
  .string()
  .min(CONSTRAINTS.PASSWORD.MIN, ValidationMessages.PASSWORD_MIN);

/**
 * Mã màu HEX - Tùy chọn
 */
export const colorHexOptional = z
  .string()
  .regex(PATTERNS.HEX_COLOR, ValidationMessages.COLOR_INVALID)
  .optional();

/**
 * Mã màu HEX - Bắt buộc với giá trị mặc định
 */
export const colorHexWithDefault = (defaultColor = "#3b82f6") =>
  z
    .string()
    .regex(PATTERNS.HEX_COLOR, ValidationMessages.COLOR_INVALID)
    .default(defaultColor);

// ============================================================
// COMPOSITE SCHEMAS (Pre-built combinations)
// ============================================================

/**
 * Thông tin liên hệ cơ bản (dùng cho booking, customer form)
 * Sử dụng snake_case cho compatibility với Backend API
 */
export const contactInfoSchema = z.object({
  full_name: fullNameRequired,
  phone_number: phoneVNRequired,
  email: emailOptional,
});

/**
 * Thông tin liên hệ cơ bản - camelCase version
 * Sử dụng cho Customer Portal
 */
export const contactInfoSchemaCamel = z.object({
  fullName: fullNameRequired,
  phone: phoneVNOptional,
  email: emailOptional,
});
