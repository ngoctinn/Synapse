/**
 * Chuẩn hóa response cho tất cả Server Actions.
 * Áp dụng Envelope Pattern để UI xử lý nhất quán.
 *
 * @example
 * // Trong Server Action:
 * return success(userData, "Cập nhật thành công")
 *
 * // Trong Client Component:
 * if (response.status === "success") {
 *   toast.success(response.message)
 * }
 */
export type ActionResponse<T = void> = {
  /** Trạng thái của action */
  status: "success" | "error"
  /** Thông báo cho người dùng (tiếng Việt) */
  message?: string
  /** Dữ liệu trả về (nếu có) */
  data?: T
  /** Field-level errors cho form validation */
  errors?: Record<string, string[]>
}

/**
 * Tạo response thành công
 */
export function success<T = void>(
  data?: T,
  message?: string
): ActionResponse<T> {
  return {
    status: "success",
    message,
    data,
  }
}

/**
 * Tạo response lỗi
 */
export function error(
  message: string,
  errors?: Record<string, string[]>
): ActionResponse<never> {
  return {
    status: "error",
    message,
    errors,
  }
}

/**
 * Type guard để kiểm tra response thành công
 */
export function isSuccess<T>(
  response: ActionResponse<T>
): response is ActionResponse<T> & { status: "success" } {
  return response.status === "success"
}

/**
 * Type guard để kiểm tra response lỗi
 */
export function isError<T>(
  response: ActionResponse<T>
): response is ActionResponse<T> & { status: "error" } {
  return response.status === "error"
}

// ============================================
// BACKWARD COMPATIBILITY (Deprecated)
// ============================================
/**
 * @deprecated Sử dụng `ActionResponse` thay thế.
 * Type này được giữ lại để tương thích ngược với code cũ.
 */
export type ActionState = {
  success?: boolean
  error?: string
  message?: string
}

/**
 * Chuyển đổi ActionState cũ sang ActionResponse mới
 * @deprecated Dùng để migration dần dần
 */
export function fromLegacyState<T = void>(
  state: ActionState,
  data?: T
): ActionResponse<T> {
  if (state.success) {
    return success(data, state.message)
  }
  return error(state.error || "Đã xảy ra lỗi không xác định")
}
