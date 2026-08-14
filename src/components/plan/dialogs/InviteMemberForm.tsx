"use client";

import { useAlert } from "@/components/AlertPopUp/AlertPopup";
import { useModal } from "@/components/shared/modal";
import { FormSelect, type FormSelectOption } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosClient from "@/helper/axiosClient";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Form, Formik, useField, type FormikHelpers } from "formik";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const SUGGEST_DEBOUNCE_MS = 350;
const SUGGEST_MIN_LENGTH = 2;

const PERMISSION_OPTIONS: FormSelectOption[] = [
  { label: "Editor — can add & edit", value: "2" },
  { label: "Viewer — read only", value: "3" },
];

const InviteMemberSchema = Yup.object().shape({
  email: Yup.string().trim().email("Enter a valid email address").required("Email is required"),
  permission_id: Yup.string().required("Select a permission level"),
});

interface InviteMemberFormValues {
  email: string;
  permission_id: string;
}

interface SuggestedUser {
  id: number;
  username: string;
  fullname: string;
  profile_picture: string;
  email_address: string;
}

function useEmailSuggestions(planId: string, email: string) {
  const query = email.trim();
  const isQueryValid = query.length >= SUGGEST_MIN_LENGTH;

  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isQueryValid) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await axiosClient.get("/plan-members/suggest", {
          params: { email: query, plan_id: planId },
          signal: controller.signal,
        });
        setSuggestions((response?.data?.data ?? []) as SuggestedUser[]);
        setHasSearched(true);
      } catch {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setHasSearched(true);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, SUGGEST_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [planId, query, isQueryValid]);

  return {
    suggestions: isQueryValid ? suggestions : [],
    isSearching: isQueryValid && isSearching,
    hasSearched: isQueryValid && hasSearched,
  };
}

function EmailSuggestField({
  name,
  label,
  planId,
}: {
  name: string;
  label?: string;
  planId: string;
}) {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const { suggestions, isSearching, hasSearched } = useEmailSuggestions(planId, field.value);
  const showError = meta.touched && !!meta.error;
  const showDropdown = isOpen && field.value.trim().length >= SUGGEST_MIN_LENGTH;

  const handleSelect = (user: SuggestedUser) => {
    helpers.setValue(user.email_address);
    helpers.setTouched(true);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <div className="relative">
        <Input
          id={name}
          type="email"
          placeholder="member@example.com"
          autoComplete="off"
          aria-invalid={showError}
          {...field}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            helpers.setTouched(true);
            setIsOpen(false);
          }}
        />
        {showDropdown ? (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
            {isSearching ? (
              <p className="px-3 py-2.5 text-sm text-muted-foreground">Searching...</p>
            ) : suggestions.length > 0 ? (
              <ul className="max-h-56 overflow-y-auto py-1">
                {suggestions.map((user) => (
                  <li key={user.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(user)}
                      className="flex w-full cursor-default items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                    >
                      <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={user.profile_picture}
                          alt={user.fullname}
                          fill
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-natural">
                          {user.fullname}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {user.email_address}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : hasSearched ? (
              <p className="px-3 py-3 text-center text-xs text-muted-foreground">
                No user found with this email.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      {showError ? <p className="text-xs text-destructive">{meta.error}</p> : null}
    </div>
  );
}

export default function InviteMemberForm() {
  const { closeModal } = useModal();
  const { showMessage } = useAlert();
  const { planId } = useParams();
  const queryClient = useQueryClient();

  const initialValues: InviteMemberFormValues = { email: "", permission_id: "" };

  const handleSubmit = async (
    values: InviteMemberFormValues,
    { setSubmitting, resetForm }: FormikHelpers<InviteMemberFormValues>
  ) => {
    try {
      const response = await axiosClient.post("/plan-members/invite", {
        plan_id: Number(planId),
        email_address: values.email.trim(),
        permission_id: Number(values.permission_id),
      });

      if (response.data?.status === "success") {
        const invited = response.data?.data;
        showMessage(
          "success",
          "Member added",
          `${invited?.fullname ?? "The user"} was added to the plan.`
        );
        queryClient.invalidateQueries({ queryKey: ["PLAN_MEMBERS", planId] });
        resetForm();
        closeModal();
      } else {
        showMessage("error", "Failed to add member", response.data?.message || "Please try again.");
      }
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message as string | undefined)
        : undefined;

      if (status === 404) {
        showMessage(
          "error",
          "No account found",
          "This person doesn't have a Flat Mate account yet."
        );
      } else if (status === 409) {
        showMessage(
          "error",
          "Already a member",
          message || "This user is already a member of this plan."
        );
      } else if (status === 400) {
        showMessage(
          "error",
          "Missing information",
          message || "Please check the form and try again."
        );
      } else {
        showMessage("error", "Failed to add member", "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={InviteMemberSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <EmailSuggestField name="email" label="Email Address" planId={String(planId)} />

          <FormSelect
            name="permission_id"
            label="Permission"
            placeholder="Select permission level"
            options={PERMISSION_OPTIONS}
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
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
