export interface ChatMessage {
  id: string;
  plan_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
}

export interface ChatMember {
  userId: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface SendMessageDTO {
  planId: string;
  userId: string;
  content: string;
}

export interface UnreadCount {
  planId: string;
  count: number;
}

export interface MarkReadDTO {
  planId: string;
  messageId: string;
}

export interface TypingEvent {
  userId: string;
  isTyping: boolean;
}

export interface ReadReceiptEvent {
  messageId: string;
}

export interface MessageSentEvent {
  tempId: string;
  message: ChatMessage;
}
