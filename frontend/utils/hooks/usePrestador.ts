'use client';

import { useCallback, useState } from 'react';
import { createPrestador, getPrestadorById, getPrestadorByUserId, listPrestadoresByCategoria } from '@/lib/use-cases/prestador';
import { Prestador } from '@/lib/types';

export function usePrestador() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (user_id: string): Promise<Prestador | null> => {
    setLoading(true);
    setError(null);
    try {
      return await createPrestador({ user_id });
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar prestador');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id: string): Promise<Prestador | null> => {
    setLoading(true);
    setError(null);
    try {
      return await getPrestadorById(id);
    } catch (err: any) {
      setError(err?.message || 'Erro ao buscar prestador');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUserId = useCallback(async (user_id: string): Promise<Prestador | null> => {
    setLoading(true);
    setError(null);
    try {
      return await getPrestadorByUserId(user_id);
    } catch (err: any) {
      setError(err?.message || 'Erro ao buscar prestador por usuário');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const listByCategoria = useCallback(async (categoria: string): Promise<Prestador[]> => {
    setLoading(true);
    setError(null);
    try {
      return await listPrestadoresByCategoria(categoria);
    } catch (err: any) {
      setError(err?.message || 'Erro ao listar prestadores');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    create,
    fetchById,
    fetchByUserId,
    listByCategoria,
  };
}
