"use client";

import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import RecentActivityItem, { type RecentActivity as Activity } from "./RecentActivityItem";

// Invalidate after adding a transaction so the feed refreshes
export const RECENT_ACTIVITIES_QUERY_KEY = "RECENT_ACTIVITIES";

const RecentActivity = () => {
  const { user_data } = useAuthData();
  const userId = user_data?.user?.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [RECENT_ACTIVITIES_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosClient.get(`/dashboard/recent-activities?user_id=${userId}`);
      return (response?.data?.data ?? []) as Activity[];
    },
    enabled: !!userId,
  });

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
      {isLoading ? (
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-6 text-center text-sm text-rose-600">
          Couldn&apos;t load recent activity.{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-semibold underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : !data?.length ? (
        <div className="flex flex-col items-center py-8 text-center">
          <History className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-natural">No activity yet</p>
          <p className="text-xs text-muted-foreground">
            Contributions and expenses from your plans will show up here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {data.map((activity) => (
            <RecentActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
