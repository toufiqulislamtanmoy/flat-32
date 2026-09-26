import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ReceiptText, ShieldCheck, Users } from "lucide-react";
import LoginForm from "@/components/Auth/Login/LoginForm";
import BrandLogo from "@/components/shared/BrandLogo";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Flat Mate to manage your shared flat plans, members, expenses and balances.",
};

const features = [
  { icon: Users, text: "Invite flatmates into shared plans" },
  { icon: ReceiptText, text: "Log meals & expenses as they happen" },
  { icon: MessageCircle, text: "Chat with your plan in real time" },
];

const LoginPage = () => {
  return (
    <main className="min-h-screen w-full bg-login-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* LEFT — brand panel (desktop only) */}
      <section className="relative hidden overflow-hidden bg-natural px-12 py-10 text-white lg:flex lg:flex-col xl:px-16">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-104 w-104 rounded-full bg-secondary/25 blur-[130px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative z-10">
          <BrandLogo textClassName="text-white" />
        </div>

        <div className="relative z-10 my-auto max-w-lg py-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Shared living, sorted
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
            Split the bills,
            <br />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              not the friendship.
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/65">
            Flat Mate keeps every rupee, meal and member of your flat in one place — so everyone
            always knows who owes what.
          </p>

          <ul className="mt-8 space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                  <Icon className="h-4 w-4 text-primary" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          {/* Product preview card */}
          <div className="mt-10 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/55">Bachelor House · This month</p>
                <p className="mt-1 text-2xl font-bold">৳18,250</p>
              </div>
              <span className="rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                +12.4%
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[68%] rounded-full bg-linear-to-r from-primary to-secondary" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-1.5">
                {["bg-primary", "bg-secondary", "bg-tertiary", "bg-violet-400"].map((color, i) => (
                  <span
                    key={color}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-natural ring-2 ring-natural ${color}`}
                  >
                    {["TA", "RH", "SK", "MN"][i]}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/55">4 members · 32 transactions</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} Flat Mate. All rights reserved.
        </p>
      </section>

      {/* RIGHT — form */}
      <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-natural sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to your dashboard.
            </p>

            <div className="mt-8">
              <LoginForm />
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-cyan-700 hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your session is encrypted and secure.
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
