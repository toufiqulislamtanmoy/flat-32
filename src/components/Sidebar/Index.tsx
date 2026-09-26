"use client";

import BrandLogo from "@/components/shared/BrandLogo";
import useAuthData from "@/hook/useAuthData";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        isActive: (pathname) => pathname === "/",
      },
    ],
  },
  {
    title: "Plans",
    items: [
      {
        name: "My Plans",
        href: "/plans",
        icon: FolderKanban,
        // Covers the list and every plan detail page, but not the create page
        isActive: (pathname) => pathname.startsWith("/plans") && pathname !== "/plans/create",
      },
      {
        name: "Create Plan",
        href: "/plans/create",
        icon: PlusCircle,
        isActive: (pathname) => pathname === "/plans/create",
      },
    ],
  },
];

const linkClass = (isActive: boolean) =>
  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary/10 text-natural"
      : "text-natural/75 hover:bg-login-background hover:text-natural"
  }`;

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user_data } = useAuthData();

  const getUserEmail = () => {
    const emailValue = user_data?.user?.email;
    if (!emailValue) return "";
    try {
      const parsed = JSON.parse(emailValue) as { email?: string; username?: string };
      return parsed.email || parsed.username || emailValue;
    } catch {
      return emailValue;
    }
  };

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

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header (mobile only — desktop uses Navbar logo) */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <BrandLogo />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg p-2 text-natural hover:bg-login-background hover:text-primary transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = item.isActive(pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={linkClass(active)}
                    >
                      {active && (
                        <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-primary" />
                      )}
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${
                          active
                            ? "text-cyan-600"
                            : "text-muted-foreground group-hover:text-natural"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: signed-in user + logout */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Image
              src={
                user_data?.user?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={user_data?.user?.name || "User"}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-natural">
                {user_data?.user?.name || "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">{getUserEmail()}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut({ redirectTo: "/login" })}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
