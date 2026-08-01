"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axiosClient from "@/helper/axiosClient";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import type { Member } from "./mock-data";

export default function MembersPreview() {
  const { planId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["PLAN_MEMBERS", planId],
    queryFn: async () => {
      const response = await axiosClient.get(`/plan-members/plan/${planId}/users`);
      return (response?.data?.data ?? []) as Member[];
    },
    enabled: !!planId,
  });

  const members = data ?? [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-natural">Members</CardTitle>
          <Button variant="ghost" size="sm">
            View All Members
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-semibold text-natural">Failed to load members</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Something went wrong. Please try again.
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-login-background text-2xl">
              👥
            </div>
            <p className="text-sm font-semibold text-natural">No Members</p>
            <p className="mt-1 text-xs text-muted-foreground">Invite members to join this plan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={member.profile_picture}
                    alt={member.fullname}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-natural truncate">{member.fullname}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email_address}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    member.access_level === "Owner"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {member.access_level}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
