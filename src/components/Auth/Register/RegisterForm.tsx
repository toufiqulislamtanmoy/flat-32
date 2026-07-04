"use client";

import { useAlert } from "@/components/AlertPopUp/AlertPopup";
import axiosClient from "@/helper/axiosClient";
import { Field, Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import { useState } from "react";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Enter your username"),

  fullname: Yup.string().required("Enter your full name"),

  email_address: Yup.string().email("Invalid email_address").required("Enter your email_address"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Enter your password"),

  confirmPassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const RegisterForm = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { showMessage } = useAlert();

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          fullname: "",
          email_address: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          setSubmitting(true);

          try {
            const { confirmPassword, ...payload } = values;
            const data = await axiosClient.post("/auth/users/register", payload);

            if (data?.data?.status === "success") {
              await signIn("credentials", {
                redirect: false,
                email: payload.email_address,
                password: payload.password,
              });
              showMessage("success", "Account created", "Your account is ready to use.");
              resetForm();
            } else {
              showMessage(
                "warning",
                "Registration issue",
                data?.data?.message || "Please try again."
              );
            }
          } catch (error) {
            console.log(error);
            showMessage(
              "error",
              "Registration failed",
              "We couldn't create your account. Please try again."
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Username</label>

              <Field
                name="username"
                type="text"
                placeholder="Enter your username"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />

              {errors.username && touched.username ? (
                <p className="text-red-500 text-xs my-1 ml-3">{errors.username}</p>
              ) : null}
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>

              <Field
                name="fullname"
                type="text"
                placeholder="Enter your full name"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />

              {errors.fullname && touched.fullname ? (
                <p className="text-red-500 text-xs my-1 ml-3">{errors.fullname}</p>
              ) : null}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>

              <Field
                name="email_address"
                type="email_address"
                placeholder="Enter your email_address"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />

              {errors.email_address && touched.email_address ? (
                <p className="text-red-500 text-xs my-1 ml-3">{errors.email_address}</p>
              ) : null}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>

              <Field
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />

              {errors.password && touched.password ? (
                <p className="text-red-500 text-xs my-1 ml-3">{errors.password}</p>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Confirm Password
              </label>

              <Field
                name="confirmPassword"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />

              {errors.confirmPassword && touched.confirmPassword ? (
                <p className="text-red-500 text-xs my-1 ml-3">{errors.confirmPassword}</p>
              ) : null}
            </div>

            {/* Show Password */}
            <label className="flex items-center gap-1 lg:ml-2 mt-3 ml-0 text-xs">
              <input
                type="checkbox"
                checked={isPasswordVisible}
                onChange={() => setPasswordVisible(!isPasswordVisible)}
              />

              <span>Show Password</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-full cursor-pointer bg-linear-to-r from-gradient-start-rgb to-gradient-end-rgb text-white font-semibold hover:opacity-90 transition"
            >
              Create Account
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
