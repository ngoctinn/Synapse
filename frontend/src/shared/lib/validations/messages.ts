/**
 * Thông báo lỗi validation chuẩn hóa - Tiếng Việt
 * Sử dụng cho toàn bộ ứng dụng để đảm bảo nhất quán
 */

export const ValidationMessages = {
  // Full Name
  FULL_NAME_REQUIRED: "Vui lòng nhập họ tên",
  FULL_NAME_MIN: "Họ tên phải có ít nhất 2 ký tự",
  FULL_NAME_MAX: "Họ tên không được vượt quá 50 ký tự",

  // Email
  EMAIL_REQUIRED: "Vui lòng nhập email",
  EMAIL_INVALID: "Email không hợp lệ",

  // Phone
  PHONE_REQUIRED: "Vui lòng nhập số điện thoại",
  PHONE_INVALID: "Số điện thoại không hợp lệ (VD: 0983123456)",

  // Date of Birth
  DOB_INVALID: "Ngày sinh không hợp lệ",

  // Password
  PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu",
  PASSWORD_MIN: "Mật khẩu phải có ít nhất 8 ký tự",
  PASSWORD_CONFIRM_MISMATCH: "Mật khẩu xác nhận không khớp",

  // Color
  COLOR_INVALID: "Mã màu không hợp lệ (VD: #FF5733)",

  // Generic
  REQUIRED: "Trường này là bắt buộc",
  MIN_LENGTH: (min: number) => `Phải có ít nhất ${min} ký tự`,
  MAX_LENGTH: (max: number) => `Không được vượt quá ${max} ký tự`,
} as const;
