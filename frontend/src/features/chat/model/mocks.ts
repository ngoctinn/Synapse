import { Conversation, Message } from './types';

export const MOCK_USERS = {
  me: {
    id: 'admin-1',
    name: 'Lễ tân (Bạn)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'receptionist' as const,
    status: 'online' as const,
  },
  customer1: {
    id: 'cust-1',
    name: 'Nguyễn Văn A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    role: 'customer' as const,
    status: 'online' as const,
  },
  customer2: {
    id: 'cust-2',
    name: 'Trần Thị B',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    role: 'customer' as const,
    status: 'offline' as const,
  },
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    user: MOCK_USERS.customer1,
    unreadCount: 2,
    updatedAt: new Date().toISOString(),
    tags:['VIP', 'Spa'],
    lastMessage: {
      id: 'msg-1',
      senderId: 'cust-1',
      content: 'Cho mình hỏi giá liệu trình massage body với ạ?',
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text',
    },
  },
  {
    id: 'conv-2',
    user: MOCK_USERS.customer2,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    tags:['New'],
    lastMessage: {
      id: 'msg-2',
      senderId: 'admin-1',
      content: 'Dạ mình đã đặt lịch thành công rồi ạ. Hẹn gặp chị vào 10h sáng mai nhé!',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'read',
      type: 'text',
    },
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm1',
      senderId: 'cust-1',
      content: 'Chào Spa, mình muốn tư vấn dịch vụ.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm2',
      senderId: 'admin-1',
      content: 'Chào bạn A, Synapse Spa xin nghe ạ. Bạn đang quan tâm đến dịch vụ nào bên mình?',
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      status: 'read',
      type: 'text',
    },
     {
      id: 'm3',
      senderId: 'cust-1',
      content: 'Cho mình hỏi giá liệu trình massage body với ạ?',
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text',
    },
  ],
  'conv-2': [
    {
      id: 'm1',
      senderId: 'cust-2',
      content: 'Mình muốn đặt lịch gội đầu dưỡng sinh vào sáng mai.',
      timestamp: new Date(Date.now() - 8000000).toISOString(),
      status: 'read',
      type: 'text',
    },
    {
        id: 'msg-2',
        senderId: 'admin-1',
        content: 'Dạ mình đã đặt lịch thành công rồi ạ. Hẹn gặp chị vào 10h sáng mai nhé!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read',
        type: 'text',
    },
  ]
};
