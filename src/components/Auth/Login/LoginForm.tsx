"use client";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required "),
});

const LoginForm = () => {
  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log(values);
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
                type="password"
                placeholder="Enter your password"
                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
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
