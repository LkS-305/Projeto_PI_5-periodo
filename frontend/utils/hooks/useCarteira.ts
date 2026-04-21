"use client";

import { useCallback, useState } from "react";
import {
  createCarteira,
  deleteCarteira,
  findCarteiraByPrestadorId,
  findCarteiraByUserId,
  updateCarteiraSaldo,
  updateCarteiraStatus,
  updateMetodosDePagamento,
} from "@/lib/use-cases/carteira";
import { Carteira, CarteiraStatus, PagamentosAceitos } from "@/lib/types";

export function useCarteira() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: {
      usuario_id?: string;
      prestador_id?: string;
      saldo: string;
      metodos_de_pagamento?: PagamentosAceitos;
      status: CarteiraStatus;
    }): Promise<Carteira | null> => {
      setLoading(true);
      setError(null);
      try {
        return await createCarteira(data);
      } catch (err: any) {
        setError(err?.message || "Erro ao criar carteira");
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
      return await deleteCarteira(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao deletar carteira");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUserId = useCallback(
    async (user_id: string): Promise<Carteira | null> => {
      setLoading(true);
      setError(null);
      try {
        return await findCarteiraByUserId(user_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar carteira do usuário");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchByPrestadorId = useCallback(
    async (prestador_id: string): Promise<Carteira | null> => {
      setLoading(true);
      setError(null);
      try {
        return await findCarteiraByPrestadorId(prestador_id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar carteira do prestador");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateStatus = useCallback(
    async (id: string, status: CarteiraStatus): Promise<Carteira | null> => {
      setLoading(true);
      setError(null);
      try {
        return await updateCarteiraStatus(id, status);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar status da carteira");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateBalance = useCallback(
    async (id: string, saldo: string): Promise<Carteira | null> => {
      setLoading(true);
      setError(null);
      try {
        return await updateCarteiraSaldo(id, saldo);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar saldo da carteira");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updatePaymentMethods = useCallback(
    async (
      id: string,
      metodos_de_pagamento: PagamentosAceitos,
    ): Promise<Carteira | null> => {
      setLoading(true);
      setError(null);
      try {
        return await updateMetodosDePagamento(id, metodos_de_pagamento);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar métodos de pagamento");
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
    fetchByUserId,
    fetchByPrestadorId,
    updateStatus,
    updateBalance,
    updatePaymentMethods,
  };
}
