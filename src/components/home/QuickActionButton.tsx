"use client";

import { Button } from "@/components/ui/button";

interface QuickActionButtonProps {
  label: string;
  icon?: React.ReactNode;
}

export default function QuickActionButton({ label, icon }: QuickActionButtonProps) {
  return (
    <Button variant="outline" className="gap-2">
      {icon}
      {label}
    </Button>
  );
}
