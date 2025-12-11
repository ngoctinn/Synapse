'use server';

import { NotificationChannel, NotificationEvent } from './types';

// Mock data simulation helpers
const DELAY_MS = 800;
const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export async function toggleChannelAction(
  eventId: string,
  channelId: string,
  checked: boolean
): Promise<{ success: boolean; message: string }> {
  await delay();
  return {
    success: true,
    message: `Đã ${checked ? 'bật' : 'tắt'} gửi thông báo qua kênh này`
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateChannelConfigAction(
  channelId: string,
  config: any
): Promise<{ success: boolean; message: string }> {
  await delay();
  return { success: true, message: 'Đã lưu cấu hình kênh thông báo' };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTemplateAction(
  eventId: string,
  channelId: string,
  template: any
): Promise<{ success: boolean; message: string }> {
  await delay();
  return { success: true, message: 'Đã lưu mẫu tin nhắn thành công' };
}

export async function getNotificationsConfig(): Promise<{
  channels: NotificationChannel[];
  events: NotificationEvent[];
}> {
  // This would be a real DB fetch
  await delay();
  return {
    channels: [], // Should be populated in a real app
    events: []
  };
}
