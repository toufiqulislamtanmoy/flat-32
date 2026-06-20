import RegisterForm from "@/components/Auth/Register/RegisterForm";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center ">
      <section className="relative w-full min-h-[90vh] bg-white/90 backdrop-blur-sm overflow-hidden flex flex-col lg:flex-row">
        {/* DECORATIVE BACKGROUND ELEMENTS */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

        {/* LEFT SIDE - HERO SECTION (Redesigned) */}
        <div className="relative lg:w-1/2 bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-8 md:p-12 flex flex-col justify-center items-start gap-6 overflow-hidden">
          {/* Floating gradient shapes */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[70px]" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[70px]" />

          <div className="relative z-10 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-wide">
                ✨ NEW — SMART TRACKING
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              Master your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2">
                Nutrition & Finance
              </span>
            </h1>

            <p className="text-gray-600 mt-6 text-base md:text-lg leading-relaxed max-w-md">
              Join thousands of health-conscious individuals managing their culinary investments
              with MealMate — crafted with an editorial-grade experience.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              {[
                "📊 Track meals & expenses in real-time",
                "🥗 AI-powered recipe suggestions",
                "💰 Smart budgeting for groceries",
                "📈 Visual insights & weekly reports",
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-gray-700 text-sm md:text-base"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Banner Image */}
            <div className="mt-10 rounded-2xl overflow-hidden shadow-xl border border-gray-100/50 backdrop-blur-sm">
              <Image
                src="/assets/signin_banner.PNG"
                alt="MealMate Dashboard Preview"
                width={800}
                height={500}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - REGISTER FORM (Redesigned) */}
        <div className="relative lg:w-1/2 flex items-start justify-center p-8 md:p-12 bg-white/50 backdrop-blur-sm">
          {/* Decorative ring */}
          <div className="absolute top-10 right-10 w-40 h-40 border border-primary/10 rounded-full animate-spin-slow" />
          <div
            className="absolute bottom-10 left-10 w-32 h-32 border border-secondary/10 rounded-full animate-spin-slow"
            style={{ animationDirection: "reverse" }}
          />

          <div className="relative z-10 w-full max-w-md">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Get started
              </h2>
              <p className="text-gray-500 mt-2 mb-1">Create your account in seconds</p>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3 mx-auto lg:mx-0" />
            </div>

            {/* Register Form Component */}
            <div className="mt-8">
              <RegisterForm />
            </div>

            {/* Footer / Login link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-secondary transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-gray-400 mt-4">
                By joining, you agree to our{" "}
                <a href="#" className="hover:text-primary transition">
                  Terms
                </a>{" "}
                &{" "}
                <a href="#" className="hover:text-primary transition">
                  Privacy
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
