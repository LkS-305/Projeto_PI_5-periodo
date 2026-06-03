"use client";

import { useCallback, useState } from "react";
import { AuthGateway } from "@/lib/gateways/AuthGateway";
import { useNotification } from "@/lib/contexts/NotificationContext";
import { useSession as useBaseSession } from "@/lib/contexts/SessionContext";
import type { LoginDto, RegisterDto } from "@/types/dtos/user";
import type { User } from "@/types/entities/user";

type LegacyLoginInput = {
  email: string;
  senha?: string;
  password?: string;
};

type LegacyRegisterInput = {
  email: string;
  senha?: string;
  password?: string;
  cpf?: string;
  [key: string]: unknown;
};

type LegacyUser = User & Record<string, unknown>;

function readStoredToken(): string {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("authToken") ?? "";
}

function normalizeError(err: unknown, fallback: string) {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function useSession() {
  const { user, isAuthenticated, loading, saveSession, clearSession } =
    useBaseSession();
  const { notify } = useNotification();
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (dados: LegacyLoginInput) => {
      setError(null);

      try {
        const response = await AuthGateway.loginClient({
          email: dados.email,
          senha: dados.senha ?? dados.password ?? "",
        } as LoginDto);

        saveSession(response.token, response.user as LegacyUser);
        notify("Bem-vindo de volta!", "success");

        return response.user;
      } catch (err) {
        const message = normalizeError(err, "Falha no login");
        setError(message);
        notify(message, "error");
        return null;
      }
    },
    [notify, saveSession],
  );

  const signup = useCallback(
    async (dados: LegacyRegisterInput) => {
      setError(null);

      try {
        const response = await AuthGateway.registerClient({
          email: dados.email,
          senha: dados.senha ?? dados.password ?? "",
          cpf: dados.cpf ?? "",
        } as RegisterDto);

        notify("Conta criada com sucesso!", "success");

        return response.user;
      } catch (err) {
        const message = normalizeError(err, "Falha ao registrar");
        setError(message);
        notify(message, "error");
        return null;
      }
    },
    [notify],
  );

  const logout = useCallback(() => {
    clearSession();
    notify("Você saiu do sistema", "info");
  }, [clearSession, notify]);

  const updateUser = useCallback(
    async (updates: Partial<LegacyUser>) => {
      const token = readStoredToken();
      const mergedUser = {
        ...(user as LegacyUser | null),
        ...updates,
      } as LegacyUser;

      saveSession(token, mergedUser as User);
      return mergedUser;
    },
    [saveSession, user],
  );

  return {
    user,
    isAuthenticated,
    loading,
    initialized: !loading,
    error,
    login,
    signup,
    logout,
    updateUser,
    saveSession,
    clearSession,
  };
}

export function useAuth() {
  const session = useSession();

  return {
    login: session.login,
    register: session.signup,
    logout: session.logout,
    isPending: session.loading,
    currentUser: session.user,
    isAuthenticated: session.isAuthenticated,
    loading: session.loading,
    error: session.error,
    initialized: session.initialized,
  };
}
