"use client";

import EmptyState from "@/components/home/EmptyState";
import { plansData, recentActivities } from "@/components/home/mock-data";
import PlanCard from "@/components/home/PlanCard";
import QuickActionButton from "@/components/home/QuickActionButton";
import RecentActivityItem from "@/components/home/RecentActivityItem";
import Summary from "@/components/home/Summary";

import Link from "next/link";

export default function MainPage() {
  const hasPlans = plansData.length > 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-2xl font-bold text-natural">Welcome Back 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasPlans
            ? "Manage your shared expenses with complete transparency."
            : "Create your first plan to start tracking shared expenses."}
        </p>
      </section>

      {/* Summary Cards */}
      <Summary />
      {/* <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((stat) => (
          <SummaryCard key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} />
        ))}
      </section> */}

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-3">
        <Link href={"/plans/create"}>
          <QuickActionButton label="+ Create Plan" />
        </Link>
        <QuickActionButton label="+ Join Plan" />
        <QuickActionButton label="View Reports" />
      </section>

      {/* My Plans */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-natural">My Plans</h2>
        {hasPlans ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plansData.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Plans Available"
            description="Create your first plan to start managing shared expenses."
            actionLabel="Create Plan"
          />
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-natural">Recent Activity</h2>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <RecentActivityItem
                key={activity.id}
                description={activity.description}
                timestamp={activity.timestamp}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
