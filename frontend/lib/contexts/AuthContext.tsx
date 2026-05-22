"use client";

import { useAuth as useAuthHook } from "@/utils/hooks/useAuth";
import { useSession as useSessionCtx } from "./SessionContext";

export function useSession() {
  const { login, isPending } = useAuthHook();
  const { isAuthenticated } = useSessionCtx();

  return {
    login,
    isAuthenticated,
    loading: isPending,
    error: null,
  };
}

export function useAuth() {
  const { isPending } = useAuthHook();
  const { isAuthenticated } = useSessionCtx();

  return {
    isAuthenticated,
    loading: isPending,
  };
}
