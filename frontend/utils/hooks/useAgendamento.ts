"use client";

import { useCallback, useState } from "react";
import { AgendamentoGateway } from "@/lib/gateways/AgendamentoGateway";
import { Agendamento } from "@/types/entities/agendamento";
import { CriarAgendamentoDto, AtualizarAgendamentoDto } from "@/types/dtos/agendamento";

export function useAgendamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CriarAgendamentoDto): Promise<Agendamento | null> => {
      setLoading(true);
      setError(null);
      try {
        return await AgendamentoGateway.criarAgendamento(data);
      } catch (err: any) {
        setError(err?.message || "Erro ao criar agendamento");
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
      dados: AtualizarAgendamentoDto,
    ): Promise<Agendamento | null> => {
      setLoading(true);
      setError(null);
      try {
        return await AgendamentoGateway.atualizarAgendamento(id, dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar agendamento");
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
      return await AgendamentoGateway.deletarAgendamento(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao excluir agendamento");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const listById = useCallback(
    async (agendamento_id: string): Promise<Agendamento | null> => {
      setLoading(true);
      setError(null);
      try {
        return await AgendamentoGateway.getById(agendamento_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao listar agendamentos por servico");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const listByUser = useCallback(
    async (user_id: string): Promise<Agendamento[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await AgendamentoGateway.getByUserId(user_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao listar agendamentos por usuario");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const listByPrestador = useCallback(
    async (prestador_id: string): Promise<Agendamento[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await AgendamentoGateway.getByPrestadorId(prestador_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao listar agendamentos por prestador");
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
    listById,
    listByUser,
    listByPrestador
  };
}
