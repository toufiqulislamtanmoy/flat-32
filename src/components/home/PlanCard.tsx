"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Plan } from "./mock-data";
import Link from "next/link";

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-natural">{plan.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{plan.memberCount} Members</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-login-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-sm font-semibold text-natural">{plan.balance}</p>
          </div>
          <div className="rounded-lg bg-login-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-sm font-semibold text-natural">{plan?.amount}</p>
          </div>
          <div className="rounded-lg bg-login-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Expense</p>
            <p className="text-sm font-semibold text-natural">{plan?.expanse}</p>
          </div>
          <div className="rounded-lg bg-login-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="text-sm font-semibold text-natural">{plan?.total_transactions}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">Updated {plan.lastUpdated}</p>
          <Link href={`/plans/${plan.id}`}>Open Plan</Link>
        </div>
      </CardContent>
    </Card>
  );
}
