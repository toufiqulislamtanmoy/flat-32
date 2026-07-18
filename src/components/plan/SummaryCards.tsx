import { Card, CardContent } from "@/components/ui/card";
import type { FinancialStat } from "./mock-data";

interface SummaryCardsProps {
  stats: FinancialStat[];
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-login-background text-xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-natural">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
