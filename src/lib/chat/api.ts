import axiosClient from "@/helper/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChatMember,
  ChatMessage,
  MarkReadDTO,
  RawChatMessage,
  SendMessageDTO,
  UnreadCount,
} from "./types";

const MESSAGES_LIMIT = 30;

export function chatMessagesQueryKey(planId: string, userId?: string) {
  return ["CHAT_MESSAGES", planId, userId] as const;
}

export function chatMembersQueryKey(planId: string, userId?: string) {
  return ["CHAT_MEMBERS", planId, userId] as const;
}

// the backend uses numeric ids and created_at/is_read naming; the rest of the
// chat feature works off ChatMessage's string ids + timestamp/isRead fields
export function normalizeChatMessage(raw: RawChatMessage): ChatMessage {
  return {
    id: String(raw.id),
    plan_id: String(raw.plan_id),
    sender_id: String(raw.sender_id),
    sender_name: raw.sender_name ?? "",
    sender_avatar: raw.sender_avatar ?? "",
    content: raw.content,
    timestamp: raw.created_at,
    isOwn: false, // recomputed locally by useChat relative to the current user
    isRead: !!raw.is_read,
  };
}

// GET /chat/plans/:planId/messages?user_id=&limit=30
export function useChatMessages(planId: string, userId?: string) {
  return useQuery({
    queryKey: chatMessagesQueryKey(planId, userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/chat/plans/${planId}/messages`, {
        params: { user_id: userId, limit: MESSAGES_LIMIT },
      });
      const messages = (response?.data?.data ?? []) as RawChatMessage[];
      return messages.map(normalizeChatMessage);
    },
    enabled: !!planId && !!userId,
  });
}

// POST /chat/plans/:planId/messages
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, userId, content }: SendMessageDTO) => {
      const response = await axiosClient.post(`/chat/plans/${planId}/messages`, {
        user_id: userId,
        content,
      });
      return normalizeChatMessage(response?.data?.data as RawChatMessage);
    },
    onSuccess: (_data, { planId }) => {
      queryClient.invalidateQueries({ queryKey: ["CHAT_MESSAGES", planId] });
    },
  });
}

// GET /chat/plans/:planId/members?user_id=
export function useChatMembers(planId: string, userId?: string) {
  return useQuery({
    queryKey: chatMembersQueryKey(planId, userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/chat/plans/${planId}/members`, {
        params: { user_id: userId },
      });
      return (response?.data?.data ?? []) as ChatMember[];
    },
    enabled: !!planId && !!userId,
  });
}

// GET /chat/unread-counts?user_id=
export function useUnreadCounts(userId?: string) {
  return useQuery({
    queryKey: ["CHAT_UNREAD_COUNTS", userId],
    queryFn: async () => {
      const response = await axiosClient.get("/chat/unread-counts", {
        params: { user_id: userId },
      });
      return (response?.data?.data ?? []) as UnreadCount[];
    },
    enabled: !!userId,
  });
}

// PATCH /chat/plans/:planId/read
export function useMarkAsRead() {
  return useMutation({
    mutationFn: async ({ planId, userId, messageId }: MarkReadDTO) => {
      const response = await axiosClient.patch(`/chat/plans/${planId}/read`, {
        user_id: userId,
        message_id: messageId,
      });
      return response?.data?.data;
    },
  });
}
