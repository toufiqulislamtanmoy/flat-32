"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/create-plan/PageHeader";
import PlanForm from "@/components/create-plan/PlanForm";
import PlanPreviewCard from "@/components/create-plan/PlanPreviewCard";
import InformationCard from "@/components/create-plan/InformationCard";
import { defaultPreview } from "@/components/create-plan/mock-data";

const CreatePlanPage = () => {
  const [selectedIcon, setSelectedIcon] = useState(defaultPreview.icon);

  return (
    <div className="mx-auto space-y-6">
      <PageHeader
        title="Create New Plan"
        subtitle="Start managing shared expenses by creating a new plan."
      />

      <PlanForm selectedIcon={selectedIcon} onIconSelect={setSelectedIcon} />

      <PlanPreviewCard
        icon={selectedIcon}
        name={defaultPreview.name}
        members={defaultPreview.members}
        balance={defaultPreview.balance}
        transactions={defaultPreview.transactions}
        startDate={defaultPreview.startDate}
      />

      <InformationCard />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="h-11 flex-1 cursor-pointer">Create Plan</Button>
        <Button variant="outline" className="h-11 flex-1 cursor-pointer">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreatePlanPage;
