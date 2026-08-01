"use client";

import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useChatContext } from "@/provider/ChatProvider";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, Minus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import ChatMessageList from "./ChatMessageList";

const TYPING_STOP_DELAY = 1500;
const SWIPE_CLOSE_THRESHOLD = 60;
const MAX_COMPOSER_HEIGHT = 120;

function usePlanTitle(planId: string) {
  const { user_data } = useAuthData();

  const { data } = useQuery({
    queryKey: ["PLAN", planId, user_data?.user?.id],
    queryFn: async () => {
      const response = await axiosClient.get(`/plans/${planId}`);
      return response?.data?.data;
    },
    enabled: !!user_data?.user?.id && !!planId,
  });

  return data?.title ?? "Plan Chat";
}

function useTypingNames(typingUsers: string[], members: { userId: string; name: string }[]) {
  if (typingUsers.length === 0) return null;
  const names = typingUsers.map(
    (userId) => members.find((member) => member.userId === userId)?.name ?? "Someone"
  );
  if (names.length === 1) return `${names[0]} is typing...`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} are typing...`;
}

function ChatComposer() {
  const { sendMessage, startTyping, stopTyping } = useChatContext();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_COMPOSER_HEIGHT)}px`;
  }, []);

  const handleChange = (content: string) => {
    setValue(content);
    startTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_STOP_DELAY);
  };

  const handleSend = () => {
    if (!value.trim()) return;
    sendMessage(value);
    setValue("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    stopTyping();
    requestAnimationFrame(resize);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex items-end gap-2 border-t border-border px-4 py-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          handleChange(e.target.value);
          resize();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="max-h-[120px] flex-1 resize-none rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-natural placeholder-gray-400 transition outline-none focus:border-transparent focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!value.trim()}
        aria-label="Send message"
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowUp className="size-4" />
      </button>
    </div>
  );
}

function OfflineBanner() {
  const { isConnected } = useChatContext();
  if (isConnected) return null;
  return (
    <div className="border-t border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-[11px] text-amber-700">
      You&apos;re offline. Messages will send when reconnected.
    </div>
  );
}

function ChatHeader({
  planId,
  onMinimize,
  onClose,
}: {
  planId: string;
  onMinimize: () => void;
  onClose: () => void;
}) {
  const { onlineMembers, typingUsers, members } = useChatContext();
  const planTitle = usePlanTitle(planId);
  const typingLabel = useTypingNames(typingUsers, members);

  return (
    <div className="flex items-center justify-between rounded-t-2xl bg-primary px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-primary-foreground">{planTitle}</p>
        <p className="text-xs text-primary-foreground/80">
          {typingLabel ?? `${onlineMembers.length} online`}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize chat"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/20"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/20"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function ChatPopup() {
  const { planId, closeChat } = useChatContext();
  const touchStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = event.touches[0].clientY - touchStartY.current;
    setDragOffset(Math.max(0, delta));
  };

  const handleTouchEnd = () => {
    if (dragOffset > SWIPE_CLOSE_THRESHOLD) {
      closeChat();
    }
    setDragOffset(0);
    touchStartY.current = null;
  };

  return (
    <>
      {/* Desktop popup */}
      <div className="fixed bottom-24 right-6 z-50 hidden h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:flex">
        <ChatHeader planId={planId} onMinimize={closeChat} onClose={closeChat} />
        <div className="min-h-0 flex-1">
          <ChatMessageList />
        </div>
        <OfflineBanner />
        <ChatComposer />
      </div>

      {/* Mobile bottom sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[70vh] flex-col rounded-t-2xl border-t border-border bg-white shadow-2xl transition-transform sm:hidden"
        style={{ transform: `translateY(${dragOffset}px)` }}
      >
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex justify-center rounded-t-2xl bg-primary pt-2"
        >
          <span className="h-1 w-10 rounded-full bg-primary-foreground/40" />
        </div>
        <ChatHeader planId={planId} onMinimize={closeChat} onClose={closeChat} />
        <div className="min-h-0 flex-1">
          <ChatMessageList />
        </div>
        <OfflineBanner />
        <ChatComposer />
      </div>
    </>
  );
}
