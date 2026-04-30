"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types/entities/user";

interface SessionContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  saveSession: (token: string, user: User) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { clearSession(); }
    }
    setLoading(false);
  }, []);

  const saveSession = useCallback((token: string, userData: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }, []);

  return (
    <SessionContext.Provider value={{ user, isAuthenticated: !!user, loading, saveSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession deve ser usado dentro de SessionProvider");
  return context;
};
