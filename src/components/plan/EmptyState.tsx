import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: string;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-login-background text-3xl">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-natural">{title}</h3>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
