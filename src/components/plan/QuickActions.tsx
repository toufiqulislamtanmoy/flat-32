"use client";

import { Button } from "@/components/ui/button";
import { quickActions } from "./mock-data";

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {quickActions.map((action) => (
        <Button key={action.label} variant="outline" className="gap-2">
          <span>{action.icon}</span>
          {action.label}
        </Button>
      ))}
    </div>
  );
}
