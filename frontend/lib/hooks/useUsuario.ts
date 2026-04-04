"use client";

import { useCallback, useState } from "react";
import {
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
} from "@/lib/use-cases/user";
import { Usuario } from "@/lib/types";

export function useUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchById = useCallback(async (id: string): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    try {
      return await getUserById(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao buscar usuário");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByEmail = useCallback(
    async (email: string): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await getUserByEmail(email);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar usuário por email");
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
        return await updateUserById(id, dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar usuário");
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
      return await deleteUserById(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao deletar usuário");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchById,
    fetchByEmail,
    update,
    remove,
  };
}
