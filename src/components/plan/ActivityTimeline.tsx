import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { Activity } from "./mock-data";

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-natural">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-login-background text-2xl">
              \ud83d\udcc2
            </div>
            <p className="text-sm font-semibold text-natural">No Activity</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Activity will appear here as members interact.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={activity.avatar}
                    alt={activity.memberName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-natural">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute ml-4 mt-8 h-4 w-px bg-border" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
