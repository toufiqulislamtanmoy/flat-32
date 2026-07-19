"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Settings, X, Home, UtensilsCrossed, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plansData } from "@/components/home/mock-data";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const planIcons: Record<number, typeof Home> = {
    1: Home,
    2: UtensilsCrossed,
    3: Plane,
  };

  const navItems = [{ name: "Dashboard", href: "/", icon: LayoutDashboard }];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-natural/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: Logo (mobile only — desktop uses Navbar logo) */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <span className="text-lg font-bold text-natural">Flat Mate</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg p-2 text-natural hover:bg-login-background hover:text-primary transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Main section */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-natural hover:bg-login-background hover:text-primary"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Plans section */}
          <div className="mt-6">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              My Plans
            </p>
            <div className="space-y-1">
              {plansData.map((plan) => {
                const isActive = pathname === `/plans/${plan.id}`;
                const PlanIcon = planIcons[plan.id] || Home;
                return (
                  <Link
                    key={plan.id}
                    href={`/plans/${plan.id}`}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-natural hover:bg-login-background hover:text-primary"
                    }`}
                  >
                    <PlanIcon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{plan.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Create Plan */}
            <div className="mt-1">
              <Link
                href="/plans/create"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-login-background hover:text-primary transition-colors"
              >
                <Plus className="h-5 w-5 shrink-0" />
                Create Plan
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer: Settings */}
        <div className="border-t border-border px-3 py-3">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/settings"
                ? "bg-primary text-primary-foreground"
                : "text-natural hover:bg-login-background hover:text-primary"
            }`}
          >
            <Settings className="h-5 w-5 shrink-0" />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
