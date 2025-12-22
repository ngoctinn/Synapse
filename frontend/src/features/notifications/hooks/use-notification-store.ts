import { create } from 'zustand';
import { MOCK_NOTIFICATIONS } from '../model/mocks';
import { Notification } from '../model/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,

  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.read).length
  }),

  markAsRead: (id) => set((state) => {
    const notifications = state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    };
  }),

  markAllAsRead: () => set((state) => {
    const notifications = state.notifications.map(n => ({ ...n, read: true }));
    return {
      notifications,
      unreadCount: 0
    };
  }),

  fetchNotifications: async () => {
    // Mock fetch delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, fetch from API here
    set({
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length
    });
  }
}));
