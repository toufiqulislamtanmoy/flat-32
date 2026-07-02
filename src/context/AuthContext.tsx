"use client";

"use client";

import { createContext, ReactNode } from "react";
import { Session } from "next-auth";

type ExtendedSession = Session & {
  user?: Session["user"] & {
    id?: string;
    role?: string;
  };
};

interface AuthContextType {
  user_data: ExtendedSession | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: AuthContextType;
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
