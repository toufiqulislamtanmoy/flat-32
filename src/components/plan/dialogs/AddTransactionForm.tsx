"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/components/shared/modal";
import { useAlert } from "@/components/AlertPopUp/AlertPopup";
import axiosClient from "@/helper/axiosClient";
import useAuthData from "@/hook/useAuthData";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik, type FormikHelpers } from "formik";
import { useParams } from "next/navigation";
import * as Yup from "yup";
import {
  FormDatePicker,
  FormInput,
  FormSelect,
  FormTextarea,
  type FormSelectOption,
} from "@/components/shared/form";

const ENTRY_TYPE_OPTIONS: FormSelectOption[] = [
  { label: "Debit", value: "1" },
  { label: "Credit", value: "2" },
];

const MealEntrySchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .moreThan(0, "Amount must be greater than 0"),
  date: Yup.string().required("Date is required"),
  entry_type_id: Yup.string().required("Entry type is required"),
  details: Yup.string().trim().required("Details are required"),
});

interface MealEntryFormValues {
  title: string;
  amount: string;
  date: string;
  entry_type_id: string;
  details: string;
}

export default function AddTransactionForm() {
  const { closeModal } = useModal();
  const { showMessage } = useAlert();
  const { user_data } = useAuthData();
  const { planId } = useParams();
  const queryClient = useQueryClient();

  const initialValues: MealEntryFormValues = {
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    entry_type_id: "",
    details: "",
  };

  const handleSubmit = async (
    values: MealEntryFormValues,
    { setSubmitting, resetForm }: FormikHelpers<MealEntryFormValues>
  ) => {
    try {
      const payload = {
        title: values.title.trim(),
        amount: Number(values.amount),
        date: values.date,
        details: values.details.trim(),
        user_id: Number(user_data?.user?.id),
        plan_id: Number(planId),
        entry_type_id: Number(values.entry_type_id),
      };

      const response = await axiosClient.post("/meal-entries/create", payload);

      if (response.data?.status === "success") {
        showMessage("success", "Transaction added", "The meal entry was recorded successfully.");
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["PLAN", planId, user_data?.user?.id] });
        queryClient.invalidateQueries({ queryKey: ["PLAN_TRANSACTIONS"] });
        closeModal();
      } else {
        showMessage(
          "error",
          "Failed to add transaction",
          response.data?.message || "Please try again."
        );
      }
    } catch {
      showMessage("error", "Failed to add transaction", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={MealEntrySchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-5">
          <FormInput name="title" label="Title" placeholder="e.g. 1 kg Allu" />

          <div className="grid grid-cols-2 gap-4">
            <FormInput name="amount" label="Amount" type="number" placeholder="0.00" step="0.01" />
            <FormSelect
              name="entry_type_id"
              label="Entry Type"
              placeholder="Select type"
              options={ENTRY_TYPE_OPTIONS}
            />
          </div>

          <FormDatePicker name="date" label="Date" />

          <FormTextarea
            name="details"
            label="Details"
            placeholder="e.g. 1 kg alu kinlam"
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-[#00d1ff] to-[#10b981] text-white"
            >
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
