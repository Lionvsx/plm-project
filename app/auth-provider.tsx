"use client";

import type { getServerSession } from "@/controllers/auth";
import { User } from "@/db/schema";
import * as React from "react";

interface AuthContextType {
  user: User | null
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
});

export function AuthProvider({ children, session }: { children: React.ReactNode, session: NonNullable<Awaited<ReturnType<typeof getServerSession>>> }) {
  const user = session.user as User

  const value = React.useMemo(
    () => ({
      user,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useUser() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
