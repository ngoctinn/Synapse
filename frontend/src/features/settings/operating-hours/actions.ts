'use server';

import { MOCK_OPERATING_HOURS } from './model/mocks';
import { OperatingHoursConfig } from './model/types';

/**
 * Fetch operating hours configuration.
 * Currently simulates a database call with mock data.
 */
export async function getOperatingHours(): Promise<OperatingHoursConfig> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MOCK_OPERATING_HOURS;
}

/**
 * Update operating hours configuration.
 * Currently simulates a database update.
 */
export async function updateOperatingHours(data: OperatingHoursConfig): Promise<{ success: boolean; message: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, this would validate and save to DB

  return { success: true, message: 'Cập nhật cấu hình thành công' };
}
