"use client";

import RecentActivityItem, { type RecentActivity } from "@/components/home/RecentActivityItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useInfiniteQuery } from "@tanstack/react-query";
import { History, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

// Invalidate after adding a transaction / sending a message so the timeline refreshes
export const PLAN_ACTIVITIES_QUERY_KEY = "PLAN_ACTIVITIES";

const PAGE_SIZE = 10;

type ActivityFilter = "all" | "transaction" | "message";

const filters: { label: string; value: ActivityFilter }[] = [
  { label: "All", value: "all" },
  { label: "Transactions", value: "transaction" },
  { label: "Messages", value: "message" },
];

export default function ActivityTimeline() {
  const { planId } = useParams();
  const { user_data } = useAuthData();
  const userId = user_data?.user?.id;
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [PLAN_ACTIVITIES_QUERY_KEY, String(planId), userId, filter],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          user_id: String(userId),
          limit: String(PAGE_SIZE),
          offset: String(pageParam),
        });
        if (filter !== "all") params.set("type", filter);

        const response = await axiosClient.get(`/plans/${planId}/activities?${params}`);
        return (response?.data?.data ?? []) as RecentActivity[];
      },
      initialPageParam: 0,
      // A short page means we've reached the end
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
      enabled: !!planId && !!userId,
    });

  const activities = data?.pages.flat() ?? [];

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold text-natural">Recent Activity</CardTitle>
        <div className="inline-flex rounded-lg bg-login-background p-1">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filter === item.value
                  ? "bg-white text-natural shadow-sm"
                  : "text-muted-foreground hover:text-natural"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-sm text-rose-600">
            Couldn&apos;t load activity.{" "}
            <button
              type="button"
              onClick={() => refetch()}
              className="font-semibold underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-login-background">
              <History className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-natural">No Activity</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Activity will appear here as members interact.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {activities.map((activity) => (
                // Transactions and messages come from different tables, so ids can collide
                <RecentActivityItem
                  key={`${activity.type}-${activity.id}`}
                  activity={activity}
                  showPlan={false}
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
