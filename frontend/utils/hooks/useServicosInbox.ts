"use client";

import { useCallback, useEffect, useState } from "react";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";
import { ServicoGateway } from "@/lib/gateways/ServicoGateway";
import { Servico } from "@/types/entities/servico";

/**
 * Serviços onde o utilizador participa: como cliente (user_id) ou como prestador.
 */
export function useServicosInbox(userId: string | undefined) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId?.trim()) {
      setServicos([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [comoCliente, perfilPrestador] = await Promise.all([
        ServicoGateway.getByUserId(userId),
        PrestadorGateway.getByUserId(userId),
      ]);

      const comoPrestador =
        perfilPrestador?.user_id != null
          ? ((await ServicoGateway.getByPrestadorId(perfilPrestador.user_id)) ??
            [])
          : [];

      const byId = new Map<string, Servico>();
      for (const s of comoCliente) {
        if (s.id) byId.set(s.id, s);
      }
      for (const s of comoPrestador) {
        if (s.id) byId.set(s.id, s);
      }
      const merged = [...byId.values()].sort((a, b) => {
        const tb = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
        const ta = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
        return tb - ta;
      });
      setServicos(merged);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao listar serviços");
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { servicos, loading, error, reload };
}
