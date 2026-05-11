"use client";

import { useCallback, useState } from "react";


import { Servico } from "@/types/entities/servico";
import { AtualizarServicoDto, CriarServicoDto } from "@/types/dtos/servico";
import { ServicoGateway } from "@/lib/gateways/ServicoGateway";

export function useServico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CriarServicoDto): Promise<Servico | null> => {
      setLoading(true);
      setError(null);
      try {
        return await ServicoGateway.criarServico(data);
      } catch (err: any) {
        setError(err?.message || "Erro ao criar serviço");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateServico = useCallback(
    async (id: string, dados: AtualizarServicoDto): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        return await ServicoGateway.atualizarServico(id, dados) ? true : false;
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar status do serviço");
        return false;
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
      return await ServicoGateway.getById(id);
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
        return await ServicoGateway.getByUserId(user_id);
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
        return await ServicoGateway.getByPrestadorId(prestador_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar serviços do prestador");
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
    updateServico,
  };
}
