"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Transaction } from "./mock-data";

const RECENT_TRANSACTIONS_LIMIT = 5;

export default function RecentTransactions() {
  const { planId } = useParams();
  const { user_data } = useAuthData();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["PLAN_TRANSACTIONS", planId, user_data?.user?.id, RECENT_TRANSACTIONS_LIMIT],
    queryFn: async () => {
      const response = await axiosClient.post("/meal-entries/transactions", {
        plan_id: String(planId),
        user_id: String(user_data?.user?.id),
        limit: RECENT_TRANSACTIONS_LIMIT,
      });
      return (response?.data?.data ?? []) as Transaction[];
    },
    enabled: !!planId && !!user_data?.user?.id,
  });

  const transactions = data ?? [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-natural">
            Recent Transactions
          </CardTitle>
          <Link href={`/plans/${planId}/transaction`}>
            <Button variant="ghost" size="sm">
              View All Transactions
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-semibold text-natural">Failed to load transactions</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Something went wrong. Please try again.
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-login-background text-2xl">
              💳
            </div>
            <p className="text-sm font-semibold text-natural">No Transactions</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Transactions will appear here once recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={tx.avatar} alt={tx.member_name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-natural truncate">{tx.member_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{tx.meal_title}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      tx.entry_type === "Credit"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {tx.entry_type}
                  </span>
                  <p
                    className={`text-sm font-semibold ${
                      tx.entry_type === "Credit" ? "text-secondary" : "text-natural"
                    }`}
                  >
                    {tx.entry_type === "Credit" ? "+" : "-"}
                    {tx.amount}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{formatDate(tx.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
