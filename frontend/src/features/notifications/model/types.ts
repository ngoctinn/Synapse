export type NotificationType = 'booking' | 'system' | 'alert' | 'staff';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  createdAt: string; // ISO String
  read: boolean;
  actionUrl?: string; // Link to resource logic
  meta?: {
    // Optional metadata for specific rendering behavior
    avatarUrl?: string;
    customerName?: string;
  };
}

export type NotificationFilter = 'all' | 'unread';
