import LoginForm from "@/components/Auth/Login/LoginForm";
import Image from "next/image";

const LoginPage = () => {
  return (
    <main className="min-h-screen w-full bg-login-background flex items-center justify-center p-4">
      <section className="relative w-full h-[90vh] bg-white rounded overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative bg-gray-200 px-8 md:px-14 py-10 flex flex-col justify-center overflow-hidden">
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Precision in <br />
              <span className="text-secondary">Nutrition & Finance.</span>
            </h1>

            <p className="text-gray-600 mt-5 max-w-lg text-base leading-relaxed">
              Join thousands of health-conscious individuals managing their culinary investments
              with MealMate — crafted with an editorial-grade experience.
            </p>

            <div className="mt-10">
              <Image
                src="/assets/signin_banner.PNG"
                alt="login_banner"
                width={800}
                height={500}
                className="w-full max-w-xl h-auto rounded-2xl border border-gray-300 shadow-lg object-cover"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center justify-center px-6 md:px-14 py-10 bg-login-background">
          {/* subtle gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-3xl rounded-full" />

          <div className="relative z-10 w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2 mb-8">
              Enter your credentials to access your dashboard.
            </p>
            <LoginForm />
            <p className="text-sm text-gray-500 mt-6 text-center">
              Don’t have an account?{" "}
              <span className="text-primary font-semibold cursor-pointer">Register</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
