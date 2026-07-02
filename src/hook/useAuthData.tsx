"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const useAuthData = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthData must be used within AuthProvider");
  }

  return context;
};

export default useAuthData;
