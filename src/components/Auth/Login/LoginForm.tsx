"use client";

import { useAlert } from "@/components/AlertPopUp/AlertPopup";
import { Field, Form, Formik } from "formik";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Enter your email"),
  password: Yup.string().required("Enter your password"),
});

// Only allow same-origin relative paths from `?from=` to avoid open redirects
const getRedirectPath = () => {
  const from = new URLSearchParams(window.location.search).get("from");
  return from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
};

const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-xl border bg-login-background/60 pl-11 pr-4 text-sm text-natural placeholder:text-gray-400 transition focus:bg-white focus:outline-none focus:ring-4 ${
    hasError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-border focus:border-primary focus:ring-primary/15"
  }`;

const LoginForm = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { showMessage } = useAlert();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        try {
          const response = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });

          if (response?.error) {
            showMessage("error", "Sign in failed", "Please check your credentials and try again.");
            setSubmitting(false);
          } else {
            showMessage("success", "Welcome back", "You are now signed in.");
            // Full navigation so middleware and SessionProvider both see the new session cookie
            window.location.replace(getRedirectPath());
          }
        } catch {
          showMessage("error", "Sign in failed", "Something went wrong. Please try again.");
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => {
        const emailError = !!(errors.email && touched.email);
        const passwordError = !!(errors.password && touched.password);

        return (
          <Form className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-natural">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={emailError}
                  className={inputClass(emailError)}
                />
              </div>
              {emailError && <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-natural">
                  Password
                </label>
                <Link
                  href="/forget-password"
                  className="text-xs font-medium text-cyan-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Field
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={passwordError}
                  className={`${inputClass(passwordError)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((prev) => !prev)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-login-background hover:text-natural cursor-pointer"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-gradient-start-rgb to-gradient-end-rgb font-semibold text-white shadow-lg shadow-primary/25 transition hover:opacity-95 hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
