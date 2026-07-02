"use client";
import useAuthData from "@/hook/useAuthData";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user_data } = useAuthData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement | null>(null);

  console.log("user_data", user_data);

  // Close profile popup when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserEmail = () => {
    const emailValue = user_data?.user?.email;

    if (!emailValue) {
      return "user@example.com";
    }

    if (typeof emailValue === "string") {
      try {
        const parsedEmail = JSON.parse(emailValue) as {
          email?: string;
          username?: string;
        };
        return parsedEmail.email || parsedEmail.username || emailValue;
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

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-content font-bold text-xl">L</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-natural">
              Logo<span className="text-primary">.</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-natural hover:text-primary transition-colors duration-200 font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-natural hover:text-primary transition-colors duration-200 font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-natural hover:text-primary transition-colors duration-200 font-medium"
            >
              Services
            </a>
            <a
              href="#"
              className="text-natural hover:text-primary transition-colors duration-200 font-medium"
            >
              Contact
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full bg-login-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-natural placeholder-gray-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right Section - User Profile */}
          <div className="flex items-center space-x-4">
            {/* Profile Image with Popup */}
            <div className="relative" ref={profileRef}>
              <div
                className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden cursor-pointer hover:border-secondary transition-colors duration-200"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <Image
                  alt="Profile"
                  src={user_data?.user?.image || ""}
                  height={50}
                  width={50}
                  className="object-cover h-full w-full"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-secondary border-2 border-white"></span>

              {/* Profile Popup */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 bg-login-background border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden flex-shrink-0">
                        <Image
                          alt="Profile"
                          src={user_data?.user?.image || ""}
                          height={48}
                          width={48}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-natural truncate">
                          {user_data?.user?.name || "User Name"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{getUserEmail()}</p>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Role</span>
                      <span className="text-natural font-medium">
                        {user_data?.user?.role || "User"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-content">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Logout Button */}
                  <div className="px-4 py-3">
                    <button
                      onClick={handleLogout}
                      className="w-full flex hover:cursor-pointer items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-content font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-natural hover:text-primary hover:bg-login-background focus:outline-none transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="px-2 pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-full bg-login-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-natural placeholder-gray-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-natural hover:text-primary hover:bg-login-background transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-natural hover:text-primary hover:bg-login-background transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-natural hover:text-primary hover:bg-login-background transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-natural hover:text-primary hover:bg-login-background transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
