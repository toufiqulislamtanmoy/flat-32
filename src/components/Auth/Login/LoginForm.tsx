"use client";
import { Field, Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import { useState } from "react";
import * as Yup from "yup";
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Enter your email"),
  password: Yup.string().required("Enter your password"),
});

const LoginForm = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          await signIn("credentials", values);
        }}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              {errors.email && touched.email ? (
                <p className="text-red-500 text-xs my-1 ml-3">{errors.email}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
              <Field
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <label
                htmlFor="show_password"
                className="flex item-center gap-1 lg:ml-2 mt-3 ml-0 text-xs"
              >
                <input
                  type="checkbox"
                  name="show_password"
                  id=""
                  checked={isPasswordVisible}
                  onChange={() => setPasswordVisible(!isPasswordVisible)}
                />
                <span className="">Show Password</span>
              </label>
              {errors.password && touched.password ? (
                <p className="text-red-500 text-xs my-1 ml-3">{errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-full cursor-pointer bg-gradient-to-r from-gradient-start-rgb  to-gradient-end-rgb text-white font-semibold hover:opacity-90 transition"
            >
              Sign In
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
