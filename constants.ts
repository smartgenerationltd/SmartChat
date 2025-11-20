import { User, Chat, Message, MessageStatus, MessageType } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'You',
  avatar: 'https://picsum.photos/200/200?random=99',
  phoneNumber: '+1 555 0199',
  about: 'Hey there! I am using WhatsChat.'
};

export const GEMINI_USER: User = {
  id: 'gemini',
  name: 'Gemini AI',
  avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', 
  phoneNumber: 'AI',
  about: 'Always here to help.'
};

export const CONTACTS: User[] = [
  GEMINI_USER,
  {
    id: 'u1',
    name: 'Alice Johnson',
    avatar: 'https://picsum.photos/200/200?random=1',
    phoneNumber: '+1 555 0101',
    about: 'Busy working 💻'
  },
  {
    id: 'u2',
    name: 'Bob Smith',
    avatar: 'https://picsum.photos/200/200?random=2',
    phoneNumber: '+1 555 0102',
    about: 'At the gym 🏋️'
  },
  {
    id: 'u3',
    name: 'Family Group',
    avatar: 'https://picsum.photos/200/200?random=3',
    phoneNumber: '',
    about: 'Family first ❤️'
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'c1',
    participant: GEMINI_USER,
    unreadCount: 1,
    isGroup: false,
    isOnline: true,
    lastMessage: {
      id: 'm0',
      chatId: 'c1',
      senderId: 'gemini',
      content: 'Hello! I am Gemini. Ask me anything!',
      timestamp: Date.now() - 10000,
      status: MessageStatus.READ,
      type: MessageType.TEXT,
      isMe: false
    }
  },
  {
    id: 'c2',
    participant: CONTACTS[1], // Alice
    unreadCount: 2,
    isGroup: false,
    lastMessage: {
      id: 'm1',
      chatId: 'c2',
      senderId: 'u1',
      content: 'See you tomorrow!',
      timestamp: Date.now() - 3600000,
      status: MessageStatus.DELIVERED,
      type: MessageType.TEXT,
      isMe: false
    }
  },
  {
    id: 'c3',
    participant: CONTACTS[2], // Bob
    unreadCount: 0,
    isGroup: false,
    lastMessage: {
      id: 'm2',
      chatId: 'c3',
      senderId: 'me',
      content: 'Can you send the PDF?',
      timestamp: Date.now() - 86400000,
      status: MessageStatus.READ,
      type: MessageType.TEXT,
      isMe: true
    }
  }
];
