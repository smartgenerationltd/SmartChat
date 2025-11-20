export interface User {
  id: string;
  name: string;
  avatar: string;
  phoneNumber: string;
  about: string;
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VOICE = 'VOICE',
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: MessageStatus;
  type: MessageType;
  isMe: boolean;
}

export interface Chat {
  id: string;
  participant: User;
  unreadCount: number;
  lastMessage?: Message;
  isGroup: boolean;
  isOnline?: boolean;
  typing?: boolean;
}

export type Tab = 'CHATS' | 'STATUS' | 'CALLS';
