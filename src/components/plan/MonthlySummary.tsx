import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyData } from "./mock-data";

interface MonthlySummaryProps {
  data: MonthlyData;
}

export default function MonthlySummary({ data }: MonthlySummaryProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-natural">Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-login-background px-4 py-3">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="mt-1 text-lg font-bold text-secondary">{data.income}</p>
          </div>
          <div className="rounded-xl bg-login-background px-4 py-3">
            <p className="text-xs text-muted-foreground">Expense</p>
            <p className="mt-1 text-lg font-bold text-destructive">{data.expense}</p>
          </div>
          <div className="rounded-xl bg-login-background px-4 py-3">
            <p className="text-xs text-muted-foreground">Remaining Balance</p>
            <p className="mt-1 text-lg font-bold text-natural">{data.remaining}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
