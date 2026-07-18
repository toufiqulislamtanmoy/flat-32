"use client";

import useAuthData from "@/hook/useAuthData";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Search,
  Bell,
  Menu,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { user_data } = useAuthData();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement | null>(null);

  const getUserEmail = () => {
    const emailValue = user_data?.user?.email;
    if (!emailValue) return "user@example.com";
    if (typeof emailValue === "string") {
      try {
        const parsed = JSON.parse(emailValue) as { email?: string; username?: string };
        return parsed.email || parsed.username || emailValue;
      } catch {
        return emailValue;
      }
    }
    return String(emailValue);
  };

  const handleLogout = () => {
    signOut();
    setIsProfileOpen(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        event.target instanceof Node &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-lg p-2 text-natural hover:bg-login-background hover:text-primary transition-colors lg:hidden cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-natural hidden sm:inline">
              Flat Mate
            </span>
          </Link>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search plans, members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-login-background py-2 pl-10 pr-4 text-sm text-natural placeholder-muted-foreground border border-transparent focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          {/* Search button (mobile) */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-natural hover:bg-login-background hover:text-primary transition-colors md:hidden cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-lg p-2 text-natural hover:bg-login-background hover:text-primary transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-login-background transition-colors cursor-pointer"
              aria-label="User menu"
              aria-expanded={isProfileOpen}
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-border">
                <Image
                  alt="Profile"
                  src={user_data?.user?.image || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden text-sm font-medium text-natural sm:inline">
                {user_data?.user?.name || "User"}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-white shadow-lg overflow-hidden z-50">
                {/* User info */}
                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-border">
                      <Image
                        alt="Profile"
                        src={user_data?.user?.image || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-natural truncate">
                        {user_data?.user?.name || "User Name"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {getUserEmail()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 py-3 space-y-2 border-b border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium text-natural">
                      {user_data?.user?.role || "User"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                      Active
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <div className="px-2 py-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-natural hover:bg-login-background hover:text-primary transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
