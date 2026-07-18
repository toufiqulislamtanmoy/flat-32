"use client";

interface FloatingChatButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export default function FloatingChatButton({
  unreadCount,
  onClick,
}: FloatingChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-lg transition-transform hover:scale-105 cursor-pointer"
    >
      \ud83d\udcac
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
