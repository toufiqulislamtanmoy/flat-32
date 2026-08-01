import axiosClient from "@/helper/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMember, ChatMessage, MarkReadDTO, SendMessageDTO, UnreadCount } from "./types";

const MESSAGES_LIMIT = 30;

export function chatMessagesQueryKey(planId: string, userId?: string) {
  return ["CHAT_MESSAGES", planId, userId] as const;
}

export function chatMembersQueryKey(planId: string, userId?: string) {
  return ["CHAT_MEMBERS", planId, userId] as const;
}

// the backend uses numeric ids everywhere else, so coerce to string at the
// boundary - the rest of the chat feature assumes ChatMessage.id is a string
export function normalizeChatMessage(raw: ChatMessage): ChatMessage {
  return { ...raw, id: String(raw.id) };
}

// GET /chat/plans/:planId/messages?user_id=&limit=30
export function useChatMessages(planId: string, userId?: string) {
  return useQuery({
    queryKey: chatMessagesQueryKey(planId, userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/chat/plans/${planId}/messages`, {
        params: { user_id: userId, limit: MESSAGES_LIMIT },
      });
      const messages = (response?.data?.data ?? []) as ChatMessage[];
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
      return normalizeChatMessage(response?.data?.data as ChatMessage);
    },
    onSuccess: (_data, { planId }) => {
      queryClient.invalidateQueries({ queryKey: ["CHAT_MESSAGES", planId] });
    },
  });
}

// GET /plans/:planId/members?user_id=
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

// GET /chat/unread-counts
export function useUnreadCounts() {
  return useQuery({
    queryKey: ["CHAT_UNREAD_COUNTS"],
    queryFn: async () => {
      const response = await axiosClient.get("/chat/unread-counts");
      return (response?.data?.data ?? []) as UnreadCount[];
    },
  });
}

// PATCH /chat/plans/:planId/read
export function useMarkAsRead() {
  return useMutation({
    mutationFn: async ({ planId, messageId }: MarkReadDTO) => {
      const response = await axiosClient.patch(`/chat/plans/${planId}/read`, { messageId });
      return response?.data?.data;
    },
  });
}
