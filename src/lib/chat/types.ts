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

// shape as it actually comes off the wire (REST rows and the message:new
// socket event both return this) — numeric ids, created_at/is_read naming
export interface RawChatMessage {
  id: number | string;
  plan_id: number | string;
  sender_id: number | string;
  sender_name: string | null;
  sender_avatar: string | null;
  content: string;
  created_at: string;
  is_read: boolean;
  read_by?: number[];
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
  plan_id: string;
  count: number;
}

export interface MarkReadDTO {
  planId: string;
  userId: string;
  messageId: string;
}

export interface TypingEvent {
  userId: string;
  isTyping: boolean;
}

export interface ReadReceiptEvent {
  messageId: string;
  userId: string;
  readAt: string;
}

export interface MemberPresenceEvent {
  userId: string;
}

// message:sent is a lightweight ack, not a full ChatMessage — the server
// only confirms the real id + timestamp for the tempId we sent
export interface MessageSentEvent {
  tempId: string;
  messageId: string;
  timestamp: string;
}
