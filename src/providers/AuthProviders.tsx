"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";

const AuthProvidersContent = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  return <AuthProvider value={{ user_data: session || null, status }}>{children}</AuthProvider>;
};

const AuthProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthProvidersContent>{children}</AuthProvidersContent>
    </SessionProvider>
  );
};

export default AuthProviders;
