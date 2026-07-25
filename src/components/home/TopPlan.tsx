import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useQuery } from "@tanstack/react-query";
import PlanCard from "./PlanCard";
import EmptyState from "./EmptyState";
import PlanCardSkeleton from "./PlanCardSkeleton";

const TopPlan = () => {
  const { user_data } = useAuthData();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["TOP_PLAN", user_data?.user?.id],
    queryFn: async () => {
      const response = await axiosClient.post(`/dashboard/top-plans`, {
        user_id: user_data?.user?.id,
      });
      return response?.data;
    },
    enabled: !!user_data?.user?.id,
  });

  if (isLoading) return <PlanCardSkeleton />;

  if (!isLoading && !data?.data?.length)
    return (
      <EmptyState
        title="No Plans Available"
        description="Create your first plan to start managing shared expenses."
        actionLabel="Create Plan"
      />
    );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data?.data?.map((plan: any) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export default TopPlan;
