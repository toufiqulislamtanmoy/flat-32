"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

const PlanSchema = Yup.object().shape({
  title: Yup.string().required("Plan name is required"),
  date: Yup.date().required("Start date is required"),
});

interface PlanFormProps {
  onSubmit: (values: { title: string; date: string }) => Promise<void>;
  isSubmitting: boolean;
}

export default function PlanForm({ onSubmit, isSubmitting }: PlanFormProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-natural">Plan Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            title: "",
            date: new Date().toISOString().split("T")[0],
          }}
          validationSchema={PlanSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-5">
              {/* Plan Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Plan Name <span className="text-destructive">*</span>
                </label>
                <Field
                  name="title"
                  type="text"
                  placeholder="e.g. Bachelor House"
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm text-natural placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                />
                {errors.title && touched.title ? (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.title}</p>
                ) : null}
              </div>

              {/* Start Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <Field
                  name="date"
                  type="date"
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm text-natural focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                />
                {errors.date && touched.date ? (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.date}</p>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 flex-1 rounded-lg cursor-pointer bg-linear-to-r from-gradient-start-rgb to-gradient-end-rgb text-white font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating..." : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="h-11 flex-1 rounded-lg cursor-pointer border border-gray-300 bg-white text-sm font-medium text-natural transition hover:bg-login-background"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
