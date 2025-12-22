"use server";

import { ActionResponse, error, success } from "./action-response";

/**
 * Độ trễ mô phỏng cho các Server Actions (chỉ dùng trong môi trường dev).
 * Có thể cấu hình qua biến môi trường nếu cần.
 */
const SIMULATED_DELAY_MS = process.env.NODE_ENV === "development" ? 300 : 0;

/**
 * Wrapper chuẩn hóa cho tất cả Server Actions.
 * Cung cấp:
 * - Xử lý lỗi nhất quán (try-catch)
 * - Logging lỗi với action name
 * - Độ trễ mô phỏng (dev mode)
 * - Trả về ActionResponse chuẩn
 *
 * @param actionName Tên action để log (ví dụ: "createInvoice")
 * @param operation Hàm async thực hiện logic nghiệp vụ
 * @param errorMessage Thông báo lỗi mặc định (tiếng Việt)
 *
 * @example
 * export async function getInvoices(): Promise<ActionResponse<Invoice[]>> {
 *   return executeAction("getInvoices", async () => {
 *     const invoices = await db.query.invoices.findMany();
 *     return invoices;
 *   }, "Không thể tải danh sách hóa đơn");
 * }
 */
export async function executeAction<T>(
  actionName: string,
  operation: () => Promise<T>,
  errorMessage: string = "Thao tác thất bại"
): Promise<ActionResponse<T>> {
  try {
    if (SIMULATED_DELAY_MS > 0) {
      await new Promise((r) => setTimeout(r, SIMULATED_DELAY_MS));
    }
    const data = await operation();
    return success(data);
  } catch (e) {
    console.error(`[${actionName}] Error:`, e);
    return error(errorMessage);
  }
}
