"use client";

import { Card, CardContent } from "@/components/ui/card";
import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useQuery } from "@tanstack/react-query";
import SummaryCards from "./SummaryCards";
import { useParams } from "next/navigation";

export default function PlanHeader() {
  const { user_data } = useAuthData();
  const { planId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["PLAN", planId, user_data?.user?.id],
    queryFn: async () => {
      const response = await axiosClient.get(`/plans/${planId}`);
      return response?.data?.data;
    },
    enabled: !!user_data?.user?.id && !!planId,
  });

  const plan = data;

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-login-background animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-login-background rounded animate-pulse" />
              <div className="h-4 w-64 bg-login-background rounded animate-pulse" />
              <div className="h-4 w-48 bg-login-background rounded animate-pulse" />
            </div>
          </div>
          <div className="rounded-xl bg-login-background px-4 py-3 text-center sm:text-right animate-pulse">
            <div className="h-4 w-24 bg-border rounded mx-auto sm:mx-0" />
            <div className="mt-1 h-8 w-32 bg-border rounded mx-auto sm:mx-0" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !plan) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium text-natural">Failed to load plan</p>
            <p className="text-sm mt-1">Unable to load plan details. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-secondary/10 text-secondary";
      case "completed":
        return "bg-primary/10 text-primary";
      case "archived":
        return "bg-muted-foreground/10 text-muted-foreground";
      default:
        return "bg-muted-foreground/10 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "🟢";
      case "completed":
        return "✅";
      case "archived":
        return "📦";
      default:
        return "⚪";
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-login-background text-3xl">
              {getStatusIcon(plan.status)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-natural">{plan.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Started {formatDate(plan.date)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}
                >
                  {getStatusIcon(plan.status)} {plan.status}
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>Amount: {plan.amount}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>Expenses: {plan.expanse}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{plan.total_transactions} Transactions</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-login-background px-4 py-3 text-center sm:text-right">
            <p className="text-xs text-muted-foreground">Current Balance</p>
            <p className="mt-0.5 text-2xl font-bold text-natural">{plan.balance}</p>
          </div>
        </CardContent>
      </Card>
      <SummaryCards
        stats={[
          { value: plan.balance, label: "Current Balance", icon: "💰" },
          { value: plan.amount, label: "Total Amount", icon: "📈" },
          { value: plan.expanse, label: "Total Expense", icon: "📉" },
          { value: String(plan.total_transactions), label: "Total Transactions", icon: "📊" },
        ]}
      />
    </>
  );
}
