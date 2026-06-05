"use client";

import { useCallback, useEffect, useState } from "react";
import { PortfolioGateway, PortfolioItem } from "@/lib/gateways/PortfolioGateway";

export function usePortfolio(prestadorId: string | undefined) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!prestadorId?.trim()) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await PortfolioGateway.listByPrestador(prestadorId);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar portfolio");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [prestadorId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, error, refetch };
}
