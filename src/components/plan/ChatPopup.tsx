"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChatMessage } from "./mock-data";

interface ChatPopupProps {
  planName: string;
  onlineCount: number;
  messages: ChatMessage[];
  onClose: () => void;
}

export default function ChatPopup({
  planName,
  onlineCount,
  messages,
  onClose,
}: ChatPopupProps) {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      {/* Desktop popup */}
      <div className="fixed bottom-24 right-6 z-50 hidden w-[360px] rounded-2xl border border-border bg-white shadow-2xl sm:block">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-primary px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-primary-foreground">
              {planName}
            </p>
            <p className="text-xs text-primary-foreground/80">
              {onlineCount} online
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/20 cursor-pointer"
            >
              \u2014
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/20 cursor-pointer"
            >
              \u2715
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[340px] overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isOwn ? "flex-row-reverse" : ""}`}
            >
              {!msg.isOwn && (
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={msg.avatar}
                    alt={msg.sender}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                  msg.isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-login-background text-natural"
                }`}
              >
                {!msg.isOwn && (
                  <p className="mb-0.5 text-[11px] font-semibold text-primary">
                    {msg.sender}
                  </p>
                )}
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    msg.isOwn
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-natural placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition cursor-pointer"
          >
            \u2191
          </button>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-border bg-white shadow-2xl sm:hidden">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-primary px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-primary-foreground">
              {planName}
            </p>
            <p className="text-xs text-primary-foreground/80">
              {onlineCount} online
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/20 cursor-pointer"
          >
            \u2715
          </button>
        </div>

        {/* Messages */}
        <div className="h-[300px] overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isOwn ? "flex-row-reverse" : ""}`}
            >
              {!msg.isOwn && (
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={msg.avatar}
                    alt={msg.sender}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                  msg.isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-login-background text-natural"
                }`}
              >
                {!msg.isOwn && (
                  <p className="mb-0.5 text-[11px] font-semibold text-primary">
                    {msg.sender}
                  </p>
                )}
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    msg.isOwn
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-natural placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition cursor-pointer"
          >
            \u2191
          </button>
        </div>
      </div>
    </>
  );
}
