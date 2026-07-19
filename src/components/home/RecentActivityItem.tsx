interface RecentActivityItemProps {
  description: string;
  timestamp: string;
}

export default function RecentActivityItem({ description, timestamp }: RecentActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
      <div className="flex-1">
        <p className="text-sm text-natural">{description}</p>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </div>
  );
}
