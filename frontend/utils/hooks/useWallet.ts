"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/contexts/SessionContext";
import { CarteiraGateway } from "@/lib/gateways/CarteiraGateway";
import { TransacaoGateway } from "@/lib/gateways/TransacaoGateway";
import { Carteira } from "@/types/entities/carteira";
import { Transacao } from "@/types/entities/transacao";

interface WalletState {
  carteira: Carteira | null;
  transacoes: Transacao[];
  loading: boolean;
  erro: string | null;
}

export function useWallet(): WalletState {
  const { user } = useSession();
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function carregar() {
      setLoading(true);
      setErro(null);
      try {
        const [carteiraResult, transacoesResult] = await Promise.allSettled([
          CarteiraGateway.getByUserId(user!.id),
          TransacaoGateway.getByUserId(user!.id),
        ]);
        if (carteiraResult.status === "fulfilled") {
          setCarteira(carteiraResult.value);
        } else {
          setCarteira(null);
        }
        if (transacoesResult.status === "fulfilled") {
          setTransacoes(transacoesResult.value ?? []);
        } else {
          setTransacoes([]);
        }

        const msgs: string[] = [];
        if (carteiraResult.status === "rejected") {
          const r = carteiraResult.reason;
          msgs.push(
            r instanceof Error ? r.message : "Não foi possível carregar a carteira.",
          );
        }
        if (transacoesResult.status === "rejected") {
          const r = transacoesResult.reason;
          msgs.push(
            r instanceof Error ? r.message : "Não foi possível carregar as transações.",
          );
        }
        setErro(msgs.length ? msgs.join(" ") : null);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Erro ao carregar dados financeiros";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [user?.id]);

  return { carteira, transacoes, loading, erro };
}
