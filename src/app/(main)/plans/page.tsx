"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import PlanList from "@/components/PlanList/Index";

const PlansPage = () => {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-natural">My Plans</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All the shared plans you own — open one to manage members, meals and expenses.
          </p>
        </div>
        <Link
          href="/plans/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-gradient-start-rgb to-gradient-end-rgb px-4 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          New plan
        </Link>
      </div>

      <PlanList />
    </div>
  );
};

export default PlansPage;
