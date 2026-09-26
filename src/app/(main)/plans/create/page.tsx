"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/components/AlertPopUp/AlertPopup";
import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import PageHeader from "@/components/create-plan/PageHeader";
import PlanForm from "@/components/create-plan/PlanForm";
import PlanPreviewCard from "@/components/create-plan/PlanPreviewCard";
import { defaultPreview } from "@/components/create-plan/mock-data";
import { USER_PLAN_QUERY_KEY } from "@/components/PlanList/Index";

const CreatePlanPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showMessage } = useAlert();
  const { user_data } = useAuthData();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: { title: string; date: string }) => {
    setIsSubmitting(true);

    try {
      const payload = {
        title: values.title,
        date: values.date,
        user_id: Number(user_data?.user?.id),
        amount: "0",
        balance: "0",
        expanse: "0",
        status: "active",
      };

      const response = await axiosClient.post("/plans/create", payload);

      if (response.data?.status === "success") {
        showMessage("success", "Plan created", "Your new plan is ready to use.");
        queryClient.invalidateQueries({ queryKey: [USER_PLAN_QUERY_KEY] });
        const planId = response.data?.data?.id;
        if (planId) {
          router.push(`/plans/${planId}`);
        } else {
          router.push("/");
        }
      } else {
        showMessage(
          "error",
          "Failed to create plan",
          response.data?.message || "Please try again."
        );
      }
    } catch {
      showMessage("error", "Failed to create plan", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <PageHeader
        title="Create New Plan"
        subtitle="Start managing shared expenses by creating a new plan."
      />

      <PlanForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      <PlanPreviewCard
        name={defaultPreview.name}
        balance={defaultPreview.balance}
        startDate={defaultPreview.startDate}
      />
    </div>
  );
};

export default CreatePlanPage;
