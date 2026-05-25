"use client";

<<<<<<< Updated upstream
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LoginRequest, LoginResponse, SignUpRequest } from "@/lib/types/api";
import { Usuario } from "@/lib/types/user";
import client from "@/lib/api/client";
import { useNotification } from "@/lib/contexts/NotificationContext";

interface SessionContextValue {
  user: Usuario | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<Usuario | null>;
  signup: (payload: SignUpRequest) => Promise<Usuario | null>;
  logout: () => void;
  refreshUser: () => Promise<Usuario | null>;
  updateUser: (dados: Partial<Usuario>) => Promise<Usuario | null>;
  setUser: (user: Usuario | null) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    const initializeSession = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          client.defaults.headers.common.Authorization = `Bearer ${token}`;
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }

      setInitialized(true);
      setLoading(false);
    };

    initializeSession();
  }, []);

  const persistSession = useCallback((token: string, userData: Usuario) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete client.defaults.headers.common.Authorization;
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await client.post<LoginResponse>(
          "/users/login",
          credentials,
        );
        const { token, user: userData } = response.data;

        persistSession(token, userData);
        notify("Bem-vindo de volta!", "success");
        return userData;
      } catch (err: any) {
        const message =
          err?.response?.data?.erro ||
          err?.message ||
          "Falha ao acessar a conta";
        setError(message);
        notify(message, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [notify, persistSession],
  );

  const signup = useCallback(
    async (payload: SignUpRequest): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await client.post<Usuario>(
          "/users/criarUsuario",
          payload,
        );
        notify(
          "Conta criada com sucesso. Faça login para continuar.",
          "success",
        );
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.erro || err?.message || "Falha ao criar conta";
        setError(message);
        notify(message, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [notify],
  );

  const logout = useCallback(() => {
    clearSession();
    notify("Sessão encerrada com sucesso.", "info");
  }, [clearSession, notify]);

  const refreshUser = useCallback(async (): Promise<Usuario | null> => {
    if (!user?.id) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await client.post<Usuario>("/users/buscarPorId", {
        id: user.id,
      });

      setUser(response.data);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.erro ||
        err?.message ||
        "Falha ao atualizar perfil";
      setError(message);
      notify(message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [notify, user?.id]);

  const updateUser = useCallback(
    async (dados: Partial<Usuario>): Promise<Usuario | null> => {
      if (!user?.id) {
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await client.post<Usuario>(
          "/users/atualizar-usuario",
          {
            id: user.id,
            dados,
          },
        );

        setUser(response.data);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        notify("Perfil atualizado com sucesso.", "success");
        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.erro ||
          err?.message ||
          "Falha ao atualizar perfil";
        setError(message);
        notify(message, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [notify, user?.id],
  );

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        initialized,
        error,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        refreshUser,
        updateUser,
        setUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

=======
/**
 * AuthContext
 * -----------
 * Camada unificada de autenticação que envolve o SessionContext e adiciona
 * login, logout, register, updateUser, error e initialized.
 *
 * Exporta:
 *  - useSession()  – usado pelas páginas de auth, Navbar e Profile
 *  - useAuth()     – alias de useSession(), usado pelo DashboardLayout
 */

import { useState } from "react";
import { useSession as useBaseSession } from "@/lib/contexts/SessionContext";
import { useNotification } from "@/lib/contexts/NotificationContext";
import { AuthGateway } from "@/lib/gateways/AuthGateway";
import { RegisterDto } from "@/types/dtos/user";
import { User } from "@/types/entities/user";

// Aceita tanto "password" (usado pelo form de login) quanto "senha" (LoginDto oficial)
type LoginInput = { email: string; password?: string; senha?: string };

export function useSession() {
  const {
    user,
    isAuthenticated,
    loading: baseLoading,
    saveSession,
    clearSession,
  } = useBaseSession();

  const { notify } = useNotification();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const login = async (dados: LoginInput): Promise<User | null> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await AuthGateway.loginClient({
        email: dados.email,
        senha: dados.password ?? dados.senha ?? "",
      });
      saveSession(response.token, response.user as User);
      notify("Bem-vindo de volta!", "success");
      return response.user as User;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha no login";
      setError(msg);
      notify(msg, "error");
      return null;
    } finally {
      setIsPending(false);
    }
  };

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  const logout = () => {
    clearSession();
    notify("Você saiu do sistema", "info");
  };

  // ── REGISTER ───────────────────────────────────────────────────────────────
  const register = async (dados: RegisterDto) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await AuthGateway.registerClient(dados);
      notify("Conta criada com sucesso!", "success");
      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao registrar";
      setError(msg);
      notify(msg, "error");
      return null;
    } finally {
      setIsPending(false);
    }
  };

  // ── UPDATE USER (local) ────────────────────────────────────────────────────
  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const token =
      typeof window !== "undefined"
        ? (localStorage.getItem("authToken") ?? "")
        : "";
    saveSession(token, { ...user, ...data });
  };

  return {
    // Estado
    user,
    isAuthenticated,
    loading: baseLoading || isPending,
    initialized: !baseLoading,   // true após leitura do localStorage
    error,

    // Ações de autenticação
    login,
    logout,
    register,
    signup: register,            // alias para o form de cadastro

    // Ação de perfil
    updateUser,

    // Ações baixo nível (SessionContext)
    saveSession,
    clearSession,
  };
}

/** Alias – DashboardLayout importa useAuth */
>>>>>>> Stashed changes
export function useAuth() {
  return useSession();
}
