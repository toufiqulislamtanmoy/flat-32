"use client";

import ActivityTimeline from "@/components/plan/ActivityTimeline";
import ChatPopup from "@/components/plan/ChatPopup";
import FloatingChatButton from "@/components/plan/FloatingChatButton";
import MembersPreview from "@/components/plan/MembersPreview";
import { activities, chatMessages, monthlyData, planInfo } from "@/components/plan/mock-data";
import MonthlySummary from "@/components/plan/MonthlySummary";
import PlanHeader from "@/components/plan/PlanHeader";
import QuickActions from "@/components/plan/QuickActions";
import RecentTransactions from "@/components/plan/RecentTransactions";
import { useState } from "react";

export default function PlanDetailsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PlanHeader />

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactions />
        <MembersPreview />
      </div>

      <MonthlySummary data={monthlyData} />

      <ActivityTimeline activities={activities} />

      <FloatingChatButton unreadCount={3} onClick={() => setIsChatOpen((prev) => !prev)} />

      {isChatOpen && (
        <ChatPopup
          planName={planInfo.name}
          onlineCount={3}
          messages={chatMessages}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
