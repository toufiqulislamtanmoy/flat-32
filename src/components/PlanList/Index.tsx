"use client";

import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useMemo } from "react";

type PlanItem = {
  id: number;
  title: string;
  date: string;
  status: string;
  created_at: string;
  username?: string;
  fullname?: string;
  profile_picture?: string;
  email_address?: string;
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-sky-50 text-sky-700 ring-sky-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  default: "bg-slate-100 text-slate-700 ring-slate-200",
};

const formatDate = (value?: string) => {
  if (!value) {
    return "No date";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PlanList = () => {
  const { user_data } = useAuthData();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["USER_PLAN", user_data?.user?.id],
    queryFn: async () => {
      const response = await axiosClient.post("/plans/user-plans", {
        user_id: user_data?.user?.id,
      });
      return response?.data;
    },
    enabled: !!user_data?.user?.id,
  });

  const plans = useMemo(() => {
    if (Array.isArray(data)) {
      return data as PlanItem[];
    }

    if (Array.isArray(data?.data)) {
      return data.data as PlanItem[];
    }

    return [] as PlanItem[];
  }, [data]);

  return (
    <section className="mt-6 space-y-4">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Plans</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Your active plan overview</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          {plans.length} {plans.length === 1 ? "plan" : "plans"}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded bg-slate-100" />
              <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
          We could not load your plans right now. Please try again shortly.
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">No plans yet</p>
          <p className="mt-2 text-sm text-slate-600">
            Create your first plan and it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => {
            const statusKey = (plan.status || "default").toLowerCase();
            const statusClass = statusStyles[statusKey] || statusStyles.default;

            return (
              <article
                key={plan.id}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-4 border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-primary/5 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl">
                    📅
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Scheduled for {formatDate(plan.date)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusClass}`}
                      >
                        {plan.status || "active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                    <span>Created</span>
                    <span className="font-semibold text-slate-900">
                      {formatDate(plan.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-200">
                        <Image
                          src={plan.profile_picture || "/assets/signin_banner.PNG"}
                          alt={plan.fullname || plan.username || "Plan owner"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {plan.fullname || plan.username || "Plan owner"}
                        </p>
                        <p className="text-xs text-slate-500">{plan.email_address || "No email"}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="font-medium text-slate-700">@{plan.username || "user"}</p>
                      <p>Owner</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PlanList;
