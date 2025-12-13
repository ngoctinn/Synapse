'use server';

import { ActionResponse, success } from '@/shared/lib/action-response';
import { MOCK_OPERATING_HOURS } from './model/mocks';
import { OperatingHoursConfig } from './model/types';

export async function getOperatingHours(): Promise<ActionResponse<OperatingHoursConfig>> {
  return success(MOCK_OPERATING_HOURS);
}

export async function updateOperatingHours(data: OperatingHoursConfig): Promise<ActionResponse> {
  return success(undefined, 'Cập nhật cấu hình thành công');
}
