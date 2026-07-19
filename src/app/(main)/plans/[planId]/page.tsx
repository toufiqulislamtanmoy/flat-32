"use client";

import { useState } from "react";
import PlanHeader from "@/components/plan/PlanHeader";
import SummaryCards from "@/components/plan/SummaryCards";
import QuickActions from "@/components/plan/QuickActions";
import RecentTransactions from "@/components/plan/RecentTransactions";
import MembersPreview from "@/components/plan/MembersPreview";
import MonthlySummary from "@/components/plan/MonthlySummary";
import ActivityTimeline from "@/components/plan/ActivityTimeline";
import FloatingChatButton from "@/components/plan/FloatingChatButton";
import ChatPopup from "@/components/plan/ChatPopup";
import {
  planInfo,
  financialStats,
  transactions,
  members,
  monthlyData,
  activities,
  chatMessages,
} from "@/components/plan/mock-data";

export default function PlanDetailsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PlanHeader plan={planInfo} />

      <SummaryCards stats={financialStats} />

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactions transactions={transactions} />
        <MembersPreview members={members} />
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
