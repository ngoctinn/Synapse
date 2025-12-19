"use server";

/**
 * Operating Hours Server Actions
 * TODO: Replace with real API calls to backend
 */

import { ActionResponse } from "@/shared/lib/action-response";
import { MOCK_OPERATING_HOURS } from "./mocks";
import { OperatingHoursConfig } from "./types";

/**
 * Lấy cấu hình giờ hoạt động hiện tại
 */
export async function getOperatingHours(): Promise<ActionResponse<OperatingHoursConfig>> {
  // TODO: Replace with real API call to GET /api/operating-hours
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    status: "success",
    data: MOCK_OPERATING_HOURS
  };
}

/**
 * Cập nhật cấu hình giờ hoạt động
 */
export async function updateOperatingHours(
  _config: OperatingHoursConfig
): Promise<ActionResponse> {
  // TODO: Replace with real API call to PUT /api/operating-hours

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    status: "success",
    message: "Đã lưu cấu hình giờ hoạt động thành công"
  };
}
