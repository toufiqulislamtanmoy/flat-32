"use client";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
}

export default function EmptyState({ title, description, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-login-background text-3xl">
        📋
      </div>
      <h3 className="text-lg font-semibold text-natural">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button className="mt-6">{actionLabel}</Button>
    </div>
  );
}
