import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlanCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="rounded-lg bg-login-background px-3 py-2">
                  <Skeleton className="h-3 w-14 mb-1.5" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
