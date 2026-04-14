"use client";

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

export function useAuth() {
  return useSession();
}
