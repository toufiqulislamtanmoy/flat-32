import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanPreviewCardProps {
  icon: string;
  name: string;
  members: number;
  balance: string;
  transactions: number;
  startDate: string;
}

export default function PlanPreviewCard({
  icon,
  name,
  members,
  balance,
  transactions,
  startDate,
}: PlanPreviewCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-natural">
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{icon}</span>
          <span className="text-lg font-semibold text-natural">{name}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-login-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="text-sm font-semibold text-natural">{members}</p>
          </div>
          <div className="rounded-lg bg-login-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-sm font-semibold text-natural">{balance}</p>
          </div>
          <div className="rounded-lg bg-login-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="text-sm font-semibold text-natural">{transactions}</p>
          </div>
          <div className="rounded-lg bg-login-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="text-sm font-semibold text-natural">{startDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
