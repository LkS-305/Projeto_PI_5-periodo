"use client";

import { useCallback, useState } from "react";
import { ServicoGateway } from "@/lib/gateways/ServicoGateway";
import { TransacaoGateway } from "@/lib/gateways/TransacaoGateway";
import { IniciarPagamentoDto } from "@/types/dtos/transacao";
import {
  IniciarPagamentoResponse,
  Transacao,
} from "@/types/entities/transacao";

export function usePagamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iniciarPagamento = useCallback(
    async (
      dados: IniciarPagamentoDto,
    ): Promise<IniciarPagamentoResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        return await TransacaoGateway.iniciarPagamento(dados);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao iniciar pagamento";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const simularPagamentoConfirmado = useCallback(
    async (servicoId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await ServicoGateway.confirmarPagamento(servicoId);
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao confirmar pagamento";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchByServicoId = useCallback(
    async (servicoId: string): Promise<Transacao | null> => {
      setLoading(true);
      setError(null);
      try {
        return await TransacaoGateway.getByServicoId(servicoId);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao buscar transação";
        setError(message);
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
    iniciarPagamento,
    simularPagamentoConfirmado,
    fetchByServicoId,
  };
}
