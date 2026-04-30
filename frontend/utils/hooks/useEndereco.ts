"use client";

import { EnderecoGateway } from "@/lib/gateways/EnderecoGateway";
import { useCallback, useState } from "react";
import { Endereco } from "@/types/entities/endereco";
import { CriarEnderecoDto, AtualizarEnderecoDto, RetornoApi } from '@/types/dtos/endereco';

export function useEndereco() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CriarEnderecoDto): Promise<Endereco | null> => {
      setLoading(true);
      setError(null);
      try {
        return await EnderecoGateway.criarEndereco(data);
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
      return await EnderecoGateway.deletarEndereco(id);
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
      endereco: AtualizarEnderecoDto,
    ): Promise<Endereco | null> => {
      setLoading(true);
      setError(null);
      try {
        return await EnderecoGateway.atualizarEndereco(id, endereco);
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
        return await EnderecoGateway.getByUserId(user_id);
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
        return await EnderecoGateway.getByPrestadorId(prestador_id);
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
        return await EnderecoGateway.getByCity(cidade);
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
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        return await EnderecoGateway.setPrincipal(id);
      } catch (err: any) {
        setError(err?.message || "Erro ao definir endereço principal");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const unsetPrincipal = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        return await EnderecoGateway.unsetPrincipal(id);
      } catch (err: any) {
        setError(err?.message || "Erro ao remover endereço principal");
        return false;
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
