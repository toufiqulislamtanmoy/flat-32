import { Card, CardContent } from "@/components/ui/card";
import type { PlanInfo } from "./mock-data";

interface PlanHeaderProps {
  plan: PlanInfo;
}

export default function PlanHeader({ plan }: PlanHeaderProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-login-background text-3xl">
            {plan.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-natural">{plan.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Owner: {plan.owner}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{plan.memberCount} Members</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Created {plan.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-login-background px-4 py-3 text-center sm:text-right">
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p className="mt-0.5 text-2xl font-bold text-natural">{plan.balance}</p>
        </div>
      </CardContent>
    </Card>
  );
}
