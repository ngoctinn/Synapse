'use server';

import { ActionResponse, success } from '@/shared/lib/action-response';
import { NotificationChannel, NotificationEvent } from './model/types';

// Mock data simulation helpers
const DELAY_MS = 800;
const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export async function toggleChannelAction(
  _eventId: string,
  _channelId: string,
  checked: boolean
): Promise<ActionResponse> {
  await delay();
  return success(undefined, `Đã ${checked ? 'bật' : 'tắt'} gửi thông báo qua kênh này`);
}

export async function updateChannelConfigAction(
  _channelId: string,
  _config: Record<string, unknown>
): Promise<ActionResponse> {
  await delay();
  return success(undefined, 'Đã lưu cấu hình kênh thông báo');
}

export async function updateTemplateAction(
  _eventId: string,
  _channelId: string,
  _template: Record<string, unknown>
): Promise<ActionResponse> {
  await delay();
  return success(undefined, 'Đã lưu mẫu tin nhắn thành công');
}

export async function getNotificationsConfig(): Promise<ActionResponse<{
  channels: NotificationChannel[];
  events: NotificationEvent[];
}>> {
  // This would be a real DB fetch
  await delay();
  return success({
    channels: [], // Should be populated in a real app
    events: []
  });
}
