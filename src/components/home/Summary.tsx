"use client";
import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useQuery } from "@tanstack/react-query";
import SummaryCard from "./SummaryCard";

const Summary = () => {
  const { user_data } = useAuthData();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["SUMMARY", user_data?.user?.id],
    queryFn: async () => {
      const response = await axiosClient.get(`/dashboard/summary?user_id=${user_data?.user?.id}`);
      return response?.data;
    },
    enabled: !!user_data?.user?.id,
  });

  if (isLoading)
    return <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" />;
  if (isError || !data) return null;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data?.data?.map((stat) => (
        <SummaryCard key={stat?.key} prefix={stat.prefix} value={stat.value} label={stat.label} />
      ))}
    </section>
  );
};

export default Summary;
