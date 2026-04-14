"use client";

import { useCallback, useState } from "react";
import {
  loginUser,
  signUpUser,
  fetchUserById,
  fetchUserByEmail,
  updateUser,
  deleteUser,
} from "@/lib/use-cases/auth";
import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  Usuario,
} from "@/lib/types";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        return await loginUser(credentials);
      } catch (err: any) {
        setError(err?.message || "Falha ao efetuar login");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const signUp = useCallback(
    async (payload: SignUpRequest): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await signUpUser(payload);
      } catch (err: any) {
        setError(err?.message || "Falha ao criar conta");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const findUserById = useCallback(
    async (id: string): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await fetchUserById(id);
      } catch (err: any) {
        setError(err?.message || "Falha ao buscar usuário");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const findUserByEmail = useCallback(
    async (email: string): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await fetchUserByEmail(email);
      } catch (err: any) {
        setError(err?.message || "Falha ao buscar usuário por email");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: string, dados: Partial<Usuario>): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await updateUser(id, dados);
      } catch (err: any) {
        setError(err?.message || "Falha ao atualizar usuário");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await deleteUser(id);
    } catch (err: any) {
      setError(err?.message || "Falha ao deletar usuário");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    login,
    signUp,
    findUserById,
    findUserByEmail,
    update,
    remove,
  };
}
