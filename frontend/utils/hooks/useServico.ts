"use client";

import { useCallback, useState } from "react";
import { ServicoGateway } from "@/lib/gateways/ServicoGateway";
import { Servico } from "@/types/entities/servico";
import {
  AbrirServicoDto,
  AtualizarServicoDto,
  ProporAcordoDto,
  ServicoStatus,
} from "@/types/dtos/servico";

export function useServico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro na operação de serviço";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const abrirServico = useCallback(
    (data: AbrirServicoDto) => run(() => ServicoGateway.abrirServico(data)),
    [run],
  );

  const proporAcordo = useCallback(
    (data: ProporAcordoDto) => run(() => ServicoGateway.proporAcordo(data)),
    [run],
  );

  const aceitarProposta = useCallback(
    (servicoId: string) =>
      run(async () => {
        await ServicoGateway.aceitarProposta(servicoId);
        return true;
      }),
    [run],
  );

  const recusarServico = useCallback(
    (servicoId: string) =>
      run(async () => {
        await ServicoGateway.recusarServico(servicoId);
        return true;
      }),
    [run],
  );

  const confirmarPagamento = useCallback(
    (servicoId: string) =>
      run(async () => {
        await ServicoGateway.confirmarPagamento(servicoId);
        return true;
      }),
    [run],
  );

  const finalizarServico = useCallback(
    (servicoId: string) =>
      run(async () => {
        await ServicoGateway.finalizarServico(servicoId);
        return true;
      }),
    [run],
  );

  const atualizarServico = useCallback(
    (dados: AtualizarServicoDto) =>
      run(() => ServicoGateway.atualizarServico(dados)),
    [run],
  );

  const fetchById = useCallback(
    (id: string) => run(() => ServicoGateway.getById(id)),
    [run],
  );

  const fetchByUserId = useCallback(
    (user_id: string) => run(() => ServicoGateway.getByUserId(user_id)),
    [run],
  );

  const fetchByPrestadorId = useCallback(
    (prestador_id: string) =>
      run(() => ServicoGateway.getByPrestadorId(prestador_id)),
    [run],
  );

  const fetchByStatus = useCallback(
    async (
      servicos: Servico[],
      statuses: ServicoStatus[],
    ): Promise<Servico[]> => {
      return ServicoGateway.filterByStatus(servicos, statuses);
    },
    [],
  );

  return {
    loading,
    error,
    abrirServico,
    proporAcordo,
    aceitarProposta,
    recusarServico,
    confirmarPagamento,
    finalizarServico,
    atualizarServico,
    fetchById,
    fetchByUserId,
    fetchByPrestadorId,
    fetchByStatus,
  };
}
