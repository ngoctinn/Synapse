
export type ChannelId = 'zalo' | 'sms' | 'email';

export interface NotificationChannel {
  id: ChannelId;
  name: string;
  description: string;
  isConnected: boolean;
  icon: string; // Tên icon để render
  config: Record<string, any>;
}

export interface NotificationTemplate {
  subject?: string;
  content: string;
  variables: string[]; // Danh sách biến có sẵn: {{customer_name}}, {{time}}...
}

export interface NotificationEvent {
  id: string;
  name: string;
  description: string;
  group: 'customer' | 'staff'; // Nhóm đối tượng
  channels: {
    [key in ChannelId]: boolean;
  };
  templates: {
    [key in ChannelId]?: NotificationTemplate;
  };
}
