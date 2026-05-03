"use client";

import { useCallback, useState } from "react";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";
import { Prestador } from "@/types/entities/prestador";
import { AtualizarPrestadorDto, CriarPrestadorDto } from "@/types/dtos/prestador";


export function usePrestador() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (dados: CriarPrestadorDto): Promise<Prestador | null> => {
      setLoading(true);
      setError(null);
      try {
        return await PrestadorGateway.criarPrestador(dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar prestador");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );


  const update = useCallback(
    async (id: string, dados: AtualizarPrestadorDto): Promise<Prestador | null> => {
      setLoading(true);
      setError(null);
      try {
        return await PrestadorGateway.atualizarPrestador(id, dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar prestador");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deletar = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await PrestadorGateway.deletarPrestador(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao deletar prestador");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUserId = useCallback(async (id: string): Promise<Prestador | null> => {
      setLoading(true);
      setError(null);
      try {
        return await PrestadorGateway.getByUserId(id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar prestador");
        return null;
      } finally {
        setLoading(false);
      }
      }, []);

  return {
    loading,
    error,
    create,
    deletar,
    update,
    fetchByUserId
  };
}
