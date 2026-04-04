"use client";

import { useCallback, useState } from "react";
import {
  createServico,
  getServicoById,
  getServicosByUserId,
  getServicosByPrestadorId,
  updateServicoStatus,
} from "@/lib/use-cases/servico";
import { Servico } from "@/lib/types";

export function useServico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: {
      user_id: string;
      prestador_id: string;
      endereco_id: string;
      titulo: string;
      categoria: string;
    }): Promise<Servico | null> => {
      setLoading(true);
      setError(null);
      try {
        return await createServico(data);
      } catch (err: any) {
        setError(err?.message || "Erro ao criar serviço");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchById = useCallback(async (id: string): Promise<Servico | null> => {
    setLoading(true);
    setError(null);
    try {
      return await getServicoById(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao buscar serviço");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUserId = useCallback(
    async (user_id: string): Promise<Servico[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await getServicosByUserId(user_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar serviços do usuário");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchByPrestadorId = useCallback(
    async (prestador_id: string): Promise<Servico[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await getServicosByPrestadorId(prestador_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar serviços do prestador");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateStatus = useCallback(
    async (id: string, dados: Partial<Servico>): Promise<Servico | null> => {
      setLoading(true);
      setError(null);
      try {
        return await updateServicoStatus(id, dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar status do serviço");
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
    fetchById,
    fetchByUserId,
    fetchByPrestadorId,
    updateStatus,
  };
}
