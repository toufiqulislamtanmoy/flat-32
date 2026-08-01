"use client";

import { useChatContext } from "@/provider/ChatProvider";
import { MessageCircle } from "lucide-react";

export default function FloatingChatButton() {
  const { unreadCount, isOpen, toggleChat } = useChatContext();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={toggleChat}
      aria-label="Open chat"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 cursor-pointer"
    >
      <MessageCircle className="size-6" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
