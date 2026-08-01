"use client";

import ActivityTimeline from "@/components/plan/ActivityTimeline";
import MembersPreview from "@/components/plan/MembersPreview";
import { activities, monthlyData } from "@/components/plan/mock-data";
import MonthlySummary from "@/components/plan/MonthlySummary";
import PlanHeader from "@/components/plan/PlanHeader";
import QuickActions from "@/components/plan/QuickActions";
import RecentTransactions from "@/components/plan/RecentTransactions";

export default function PlanDetailsPage() {
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
    </div>
  );
}
