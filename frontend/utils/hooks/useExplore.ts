"use client";

import { useCallback, useEffect, useState } from "react";
import { ExploreGateway } from "@/lib/gateways/ExploreGateway";
import { ExploreCategoria } from "@/types/entities/explore";

export function useExplore() {
  const [categorias, setCategorias] = useState<ExploreCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ExploreGateway.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar explore");
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { categorias, loading, error, refetch };
}
