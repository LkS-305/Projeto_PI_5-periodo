"use client";

import { useCallback, useState } from "react";
import {
  createEndereco,
  deleteEndereco,
  updateEndereco,
  findEnderecosByUserId,
  findEnderecosByPrestadorId,
  findEnderecosByCidade,
  setEnderecoPrincipal,
  unsetEnderecoPrincipal,
} from "@/lib/use-cases/endereco";
import { Endereco } from "@/lib/types";

export function useEndereco() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: Omit<Endereco, "id">): Promise<Endereco | null> => {
      setLoading(true);
      setError(null);
      try {
        return await createEndereco(data);
      } catch (err: any) {
        setError(err?.message || "Erro ao criar endereço");
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
      return await deleteEndereco(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao deletar endereço");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(
    async (
      id: string,
      endereco: Partial<Endereco>,
    ): Promise<Endereco | null> => {
      setLoading(true);
      setError(null);
      try {
        return await updateEndereco(id, endereco);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar endereço");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchByUserId = useCallback(
    async (user_id: string): Promise<Endereco[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await findEnderecosByUserId(user_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar endereços do usuário");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchByPrestadorId = useCallback(
    async (prestador_id: string): Promise<Endereco[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await findEnderecosByPrestadorId(prestador_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar endereços do prestador");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchByCidade = useCallback(
    async (cidade: string): Promise<Endereco[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await findEnderecosByCidade(cidade);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar endereços por cidade");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const setPrincipal = useCallback(
    async (id: string): Promise<Endereco | null> => {
      setLoading(true);
      setError(null);
      try {
        return await setEnderecoPrincipal(id);
      } catch (err: any) {
        setError(err?.message || "Erro ao definir endereço principal");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const unsetPrincipal = useCallback(
    async (id: string): Promise<Endereco | null> => {
      setLoading(true);
      setError(null);
      try {
        return await unsetEnderecoPrincipal(id);
      } catch (err: any) {
        setError(err?.message || "Erro ao remover endereço principal");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    create,
    remove,
    update,
    fetchByUserId,
    fetchByPrestadorId,
    fetchByCidade,
    setPrincipal,
    unsetPrincipal,
  };
}
