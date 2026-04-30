"use client";

import { useCallback, useState } from "react";
import { CategoriaGateway } from "@/lib/gateways/CategoriaGateway";
import { Categoria } from "@/types/entities/categoria";
import { AtualizarCategoriaDto, CriarCategoriaDto } from "@/types/dtos/categoria";


export function useCategoria() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (dados: CriarCategoriaDto): Promise<Categoria | null> => {
      setLoading(true);
      setError(null);
      try {
        return await CategoriaGateway.criarCategoria(dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar categoria");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );


  const update = useCallback(
    async (id: string, dados: AtualizarCategoriaDto): Promise<Categoria | null> => {
      setLoading(true);
      setError(null);
      try {
        return await CategoriaGateway.atualizarCategoria(id, dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar categoria");
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
      return await CategoriaGateway.deletarCategoria(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao deletar categoria");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id: string): Promise<Categoria | null> => {
      setLoading(true);
      setError(null);
      try {
        return await CategoriaGateway.getById(id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar categoria por id");
        return null;
      } finally {
        setLoading(false);
      }
      }, []);

  const fetchAll = useCallback(async (): Promise<Categoria[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await CategoriaGateway.getAll();
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar categorias");
        return null;
      } finally {
        setLoading(false);
      }
      }, []);

  const fetchByName = useCallback(async (nome: string): Promise<Categoria | null> => {
      setLoading(true);
      setError(null);
      try {
        return await CategoriaGateway.getByName(nome);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar categoria por nome");
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
    fetchById,
    fetchAll,
    fetchByName
  };
}
