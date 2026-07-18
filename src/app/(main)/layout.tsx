"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Index";
import Sidebar from "@/components/Sidebar/Index";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-login-background">
      <Navbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
