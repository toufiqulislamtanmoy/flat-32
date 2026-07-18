"use client";

import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  value: string;
  label: string;
  icon: string;
}

export default function SummaryCard({ value, label, icon }: SummaryCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-login-background text-xl">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-natural">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
