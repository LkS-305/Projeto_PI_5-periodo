"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/contexts/SessionContext";
import { CarteiraGateway } from "@/lib/gateways/CarteiraGateway";
import { TransacaoGateway } from "@/lib/gateways/TransacaoGateway";
import { Carteira } from "@/types/entities/carteira";
import { Transacao } from "@/types/entities/transacao";
import type { CarteiraPapel } from "@/lib/carteiraPapel";

export type { CarteiraPapel } from "@/lib/carteiraPapel";

interface WalletState {
  carteira: Carteira | null;
  transacoes: Transacao[];
  loading: boolean;
  erro: string | null;
  refetch: () => void;
}

export function useWallet(papel: CarteiraPapel): WalletState {
  const { user } = useSession();
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function carregar() {
      setLoading(true);
      setErro(null);
      try {
        if (papel === "cliente") {
          const c = await CarteiraGateway.getByUserId(user!.id).catch(() => null);
          const tx = await TransacaoGateway.getByUserId(user!.id).catch(
            () => [] as Transacao[],
          );
          setCarteira(c);
          setTransacoes(tx ?? []);
        } else {
          const c = await CarteiraGateway.getByPrestadorId(user!.id).catch(() => null);
          const tx = await TransacaoGateway.getByPrestadorId(user!.id).catch(
            () => [] as Transacao[],
          );
          setCarteira(c);
          setTransacoes(tx ?? []);
        }
      } catch (err: unknown) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar dados financeiros");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [user?.id, papel, tick]);

  return { carteira, transacoes, loading, erro, refetch };
}
