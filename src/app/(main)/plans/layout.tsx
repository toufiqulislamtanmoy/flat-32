"use client";

import ChatPopup from "@/components/plan/ChatPopup";
import FloatingChatButton from "@/components/plan/FloatingChatButton";
import { ChatProvider, useChatContext } from "@/provider/ChatProvider";
import { useParams } from "next/navigation";

function ChatOverlay() {
  const { isOpen } = useChatContext();

  return (
    <>
      <FloatingChatButton />
      {isOpen && <ChatPopup />}
    </>
  );
}

const PlansLayout = ({ children }: { children: React.ReactNode }) => {
  const { planId } = useParams<{ planId?: string }>();

  if (!planId) {
    return children;
  }

  return (
    <ChatProvider key={planId} planId={planId}>
      {children}
      <ChatOverlay />
    </ChatProvider>
  );
};

export default PlansLayout;
