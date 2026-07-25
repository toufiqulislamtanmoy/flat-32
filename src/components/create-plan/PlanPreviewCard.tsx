import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanPreviewCardProps {
  name: string;
  balance: string;
  startDate: string;
}

export default function PlanPreviewCard({ name, balance, startDate }: PlanPreviewCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-natural">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-natural mb-4">{name}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-login-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-sm font-semibold text-natural">{balance}</p>
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
