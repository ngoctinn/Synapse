export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  role: 'customer' | 'admin' | 'receptionist';
  status: 'online' | 'offline' | 'busy';
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  type: 'text' | 'image' | 'system';
  attachments?: string[];
}

export interface Conversation {
  id: string;
  user: ChatUser;
  lastMessage: Message;
  unreadCount: number;
  tags?: string[];
  updatedAt: string;
}
