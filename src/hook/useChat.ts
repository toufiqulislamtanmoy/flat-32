"use client";

import { useAlert } from "@/components/AlertPopUp/AlertPopup";
import useAuthData from "@/hook/useAuthData";
import {
  chatSocket,
  normalizeChatMessage,
  useChatMembers,
  useChatMessages,
  useMarkAsRead,
  useSendMessage,
  type ChatMessage,
  type MessageSentEvent,
  type ReadReceiptEvent,
  type TypingEvent,
} from "@/lib/chat";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useChat(planId: string) {
  const { user_data } = useAuthData();
  const { showMessage } = useAlert();
  const currentUserId = user_data?.user?.id;

  const {
    data: fetchedMessages = [],
    isLoading: isLoadingMessages,
    isError: isMessagesError,
  } = useChatMessages(planId, currentUserId);
  const { data: members = [] } = useChatMembers(planId, currentUserId);
  const sendMutation = useSendMessage();
  const markReadMutation = useMarkAsRead();

  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(() => new Set());
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const onlineMembers = useMemo(
    () => members.filter((member) => member.isOnline || onlineUserIds.has(member.userId)),
    [members, onlineUserIds]
  );

  useEffect(() => {
    if (!planId || !currentUserId) return;

    let isActive = true;
    const token = typeof window !== "undefined" ? (localStorage.getItem("accessToken") ?? "") : "";

    const handleNewMessage = (rawMessage: ChatMessage) => {
      const message = normalizeChatMessage(rawMessage);
      setLiveMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;

        // the server may broadcast our own message back without a matching
        // message:sent ack — replace the pending optimistic entry instead of
        // appending a duplicate
        const pendingIndex = prev.findIndex(
          (m) =>
            String(m.id).startsWith("temp-") &&
            m.sender_id === message.sender_id &&
            m.content === message.content
        );
        if (pendingIndex !== -1) {
          const next = [...prev];
          next[pendingIndex] = message;
          return next;
        }

        return [...prev, message];
      });
    };

    const handleMessageSent = ({ tempId, message }: MessageSentEvent) => {
      const normalized = normalizeChatMessage(message);
      setLiveMessages((prev) => prev.map((m) => (m.id === tempId ? normalized : m)));
    };

    const handleMemberJoin = ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => (prev.has(userId) ? prev : new Set(prev).add(userId)));
    };

    const handleMemberLeave = ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        if (!prev.has(userId)) return prev;
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    const handleTyping = ({ userId, isTyping }: TypingEvent) => {
      if (userId === currentUserId) return;
      setTypingUsers((prev) => {
        if (isTyping) return prev.includes(userId) ? prev : [...prev, userId];
        return prev.filter((id) => id !== userId);
      });
    };

    const handleReadReceipt = ({ messageId }: ReadReceiptEvent) => {
      setLiveMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)));
    };

    const handleError = () => {
      showMessage("error", "Chat error", "Something went wrong with the chat connection.");
    };

    chatSocket
      .connect(planId, token)
      .then(() => {
        if (isActive) setIsConnected(true);
      })
      .catch(() => {
        if (isActive) setIsConnected(false);
      });

    chatSocket.on("message:new", handleNewMessage);
    chatSocket.on("message:sent", handleMessageSent);
    chatSocket.on("member:join", handleMemberJoin);
    chatSocket.on("member:leave", handleMemberLeave);
    chatSocket.on("typing:user", handleTyping);
    chatSocket.on("read:receipt", handleReadReceipt);
    chatSocket.on("error", handleError);

    return () => {
      isActive = false;
      chatSocket.off("message:new", handleNewMessage);
      chatSocket.off("message:sent", handleMessageSent);
      chatSocket.off("member:join", handleMemberJoin);
      chatSocket.off("member:leave", handleMemberLeave);
      chatSocket.off("typing:user", handleTyping);
      chatSocket.off("read:receipt", handleReadReceipt);
      chatSocket.off("error", handleError);
      chatSocket.disconnect();
      setIsConnected(false);
      setTypingUsers([]);
    };
  }, [planId, currentUserId, showMessage]);

  const messages = useMemo(() => {
    // drop optimistic entries once the real (persisted) message has arrived via
    // the messages query, so a slow socket ack doesn't leave a duplicate bubble
    const settledLiveMessages = liveMessages.filter((live) => {
      if (!String(live.id).startsWith("temp-")) return true;
      return !fetchedMessages.some(
        (fetched) => fetched.sender_id === live.sender_id && fetched.content === live.content
      );
    });

    // isOwn must be derived locally — different sources (REST fetch, socket
    // broadcast, optimistic entry) aren't guaranteed to agree on whose message it is
    return [...fetchedMessages, ...settledLiveMessages].map((message) => ({
      ...message,
      isOwn: currentUserId != null && message.sender_id === String(currentUserId),
    }));
  }, [fetchedMessages, liveMessages, currentUserId]);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !currentUserId) return;

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: ChatMessage = {
        id: tempId,
        plan_id: planId,
        sender_id: String(currentUserId),
        sender_name: user_data?.user?.name ?? "You",
        sender_avatar: user_data?.user?.image ?? "",
        content: trimmed,
        timestamp: new Date().toISOString(),
        isOwn: true,
        isRead: false,
      };

      setLiveMessages((prev) => [...prev, optimisticMessage]);

      if (chatSocket.connected) {
        chatSocket.sendMessage(trimmed, tempId);
        return;
      }

      // offline fallback: persist via REST, reconcile the optimistic entry on success
      sendMutation.mutate(
        { planId, userId: String(currentUserId), content: trimmed },
        {
          onSuccess: (savedMessage) => {
            setLiveMessages((prev) => prev.map((m) => (m.id === tempId ? savedMessage : m)));
          },
          onError: () => {
            showMessage("error", "Message not sent", "Please check your connection and retry.");
          },
        }
      );
    },
    [planId, currentUserId, sendMutation, showMessage, user_data]
  );

  const startTyping = useCallback(() => chatSocket.startTyping(), []);
  const stopTyping = useCallback(() => chatSocket.stopTyping(), []);

  const markAsRead = useCallback(
    (messageId: string) => {
      chatSocket.markRead(messageId);
      markReadMutation.mutate({ planId, messageId });
    },
    [planId, markReadMutation]
  );

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isOwn && !m.isRead).length,
    [messages]
  );

  return {
    messages,
    onlineMembers,
    members,
    unreadCount,
    isConnected,
    typingUsers,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
  };
}
