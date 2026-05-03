"use client";

import { useCallback, useState } from "react";
import { UsuarioGateway } from "@/lib/gateways/UsuarioGateway";
import { Usuario } from "@/types/entities/usuario";
import { AtualizarUsuarioDto, CriarUsuarioDto } from "@/types/dtos/usuario";


export function useUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (dados: CriarUsuarioDto): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await UsuarioGateway.criarUsuario(dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar usuário");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );


  const update = useCallback(
    async (id: string, dados: AtualizarUsuarioDto): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await UsuarioGateway.atualizarUsuario(id, dados);
      } catch (err: any) {
        setError(err?.message || "Erro ao atualizar usuário");
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
      return await UsuarioGateway.deletarUsuario(id);
    } catch (err: any) {
      setError(err?.message || "Erro ao deletar usuário");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUserId = useCallback(async (id: string): Promise<Usuario | null> => {
      setLoading(true);
      setError(null);
      try {
        return await UsuarioGateway.getByUserId(id);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar usuário");
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
