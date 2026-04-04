"use client";

import { useCallback, useState } from "react";
import {
  createAvaliacao,
  updateAvaliacao,
  deleteAvaliacao,
  listAvaliacoes,
} from "@/lib/use-cases/avaliacao";
import { Avaliacao, AvaliarBy } from "@/lib/types";

export function useAvaliacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (
      data: Omit<Avaliacao, "id" | "created_at" | "updated_at">,
    ): Promise<Avaliacao | null> => {
      setLoading(true);
      setError(null);
      try {
        return await createAvaliacao(data);
      } catch (err: any) {
        setError(err?.message || "Erro ao criar avaliação");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      id: string,
      dados: Partial<Avaliacao>,
    ): Promise<Avaliacao | null> => {
      setLoading(true);
      setError(null);
      try {
        return await updateAvaliacao(id, dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar avaliação");
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
      return await deleteAvaliacao(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao excluir avaliação");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const listBy = useCallback(
    async (id: string, listBy: AvaliarBy): Promise<Avaliacao[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await listAvaliacoes(id, listBy);
      } catch (err: any) {
        setError(err?.message || "Erro ao listar avaliações");
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
    update,
    remove,
    listBy,
  };
}
