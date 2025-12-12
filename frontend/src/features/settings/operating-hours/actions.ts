'use server';

import { ActionResponse, success } from '@/shared/lib/action-response';
import { MOCK_OPERATING_HOURS } from './model/mocks';
import { OperatingHoursConfig } from './model/types';

/**
 * Fetch operating hours configuration.
 * Currently simulates a database call with mock data.
 */
export async function getOperatingHours(): Promise<ActionResponse<OperatingHoursConfig>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return success(MOCK_OPERATING_HOURS);
}

/**
 * Update operating hours configuration.
 * Currently simulates a database update.
 */
export async function updateOperatingHours(data: OperatingHoursConfig): Promise<ActionResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, this would validate and save to DB

  return success(undefined, 'Cập nhật cấu hình thành công');
}
