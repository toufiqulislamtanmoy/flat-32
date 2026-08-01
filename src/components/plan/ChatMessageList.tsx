"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatContext } from "@/provider/ChatProvider";
import type { ChatMessage } from "@/lib/chat";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { List, useDynamicRowHeight, useListRef, type RowComponentProps } from "react-window";
import useAuthData from "@/hook/useAuthData";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

interface MessageRowProps {
  messages: ChatMessage[];
}

function MessageRow({ index, style, messages }: RowComponentProps<MessageRowProps>) {
  const { user_data } = useAuthData();
  const msg = messages[index];
  const senderName = msg.sender_name || "Member";
  const isOwn = user_data?.user?.id == msg.sender_id;

  return (
    <div style={style} className="px-4 py-1.5">
      <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
        {!isOwn && (
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
            <Image
              src={msg.sender_avatar || DEFAULT_AVATAR}
              alt={senderName}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div
          className={`max-w-[70%] rounded-2xl px-3 py-2 ${
            isOwn ? "bg-primary text-primary-foreground" : "bg-login-background text-natural"
          }`}
        >
          {!isOwn && <p className="mb-0.5 text-[11px] font-semibold text-primary">{senderName}</p>}
          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
          <p
            className={`mt-1 text-[10px] ${
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {formatMessageTime(msg.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatMessageList() {
  const { messages, isLoading, isError } = useChatContext();
  const listRef = useListRef(null);
  const rowHeight = useDynamicRowHeight({ defaultRowHeight: 64 });
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      listRef.current?.scrollToRow({
        index: messages.length - 1,
        align: "end",
        behavior: prevCountRef.current === 0 ? "auto" : "smooth",
      });
    }
    prevCountRef.current = messages.length;
  }, [messages.length, listRef]);

  if (isLoading) {
    return (
      <div className="space-y-3 px-4 py-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}
          >
            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-sm font-medium text-natural">Failed to load messages</p>
        <p className="text-xs text-muted-foreground">Something went wrong. Please try again.</p>
        <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold text-natural">No messages yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Start the conversation!</p>
      </div>
    );
  }

  return (
    <List
      listRef={listRef}
      rowComponent={MessageRow}
      rowCount={messages.length}
      rowHeight={rowHeight}
      rowProps={{ messages }}
      rowKey={(index, data) => data.messages[index].id}
      defaultHeight={340}
      style={{ height: "100%" }}
    />
  );
}
