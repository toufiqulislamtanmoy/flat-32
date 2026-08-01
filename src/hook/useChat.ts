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
  type MemberPresenceEvent,
  type MessageSentEvent,
  type RawChatMessage,
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

    const userId = String(currentUserId);

    const handleNewMessage = (rawMessage: RawChatMessage) => {
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

    // message:sent is just a lightweight ack ({tempId, messageId, timestamp}),
    // not a full message — patch the optimistic entry's id/timestamp in place
    const handleMessageSent = ({ tempId, messageId, timestamp }: MessageSentEvent) => {
      setLiveMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, id: String(messageId), timestamp } : m))
      );
    };

    const handleMemberJoin = ({ userId: joinedUserId }: MemberPresenceEvent) => {
      const id = String(joinedUserId);
      setOnlineUserIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
    };

    const handleMemberLeave = ({ userId: leftUserId }: MemberPresenceEvent) => {
      const id = String(leftUserId);
      setOnlineUserIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };

    const handleTyping = ({ userId: typingUserId, isTyping }: TypingEvent) => {
      const id = String(typingUserId);
      if (id === userId) return;
      setTypingUsers((prev) => {
        if (isTyping) return prev.includes(id) ? prev : [...prev, id];
        return prev.filter((existing) => existing !== id);
      });
    };

    const handleReadReceipt = ({ messageId }: ReadReceiptEvent) => {
      const id = String(messageId);
      setLiveMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    };

    const handleError = () => {
      showMessage("error", "Chat error", "Something went wrong with the chat connection.");
    };

    const unsubscribeStatus = chatSocket.onStatusChange(setIsConnected);

    chatSocket.connect(planId, userId).catch(() => {
      // connection status is reported via onStatusChange; nothing else to do here
    });

    chatSocket.on("message:new", handleNewMessage);
    chatSocket.on("message:sent", handleMessageSent);
    chatSocket.on("member:join", handleMemberJoin);
    chatSocket.on("member:leave", handleMemberLeave);
    chatSocket.on("typing:user", handleTyping);
    chatSocket.on("read:receipt", handleReadReceipt);
    chatSocket.on("error", handleError);

    return () => {
      unsubscribeStatus();
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
      if (!currentUserId) return;
      chatSocket.markRead(messageId);
      markReadMutation.mutate({ planId, userId: String(currentUserId), messageId });
    },
    [planId, currentUserId, markReadMutation]
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
