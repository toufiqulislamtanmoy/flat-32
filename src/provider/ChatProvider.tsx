"use client";

import useChat from "@/hook/useChat";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface ChatContextValue extends ReturnType<typeof useChat> {
  planId: string;
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ planId, children }: { planId: string; children: ReactNode }) {
  const chat = useChat(planId);
  const [isOpen, setIsOpen] = useState(false);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo<ChatContextValue>(
    () => ({ ...chat, planId, isOpen, openChat, closeChat, toggleChat }),
    [chat, planId, isOpen, openChat, closeChat, toggleChat]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
