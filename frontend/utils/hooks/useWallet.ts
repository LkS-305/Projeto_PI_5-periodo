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
        // Busca carteira: tenta como usuário primeiro, depois como prestador
        let carteira = await CarteiraGateway.getByUserId(user!.id).catch(() => null);
        if (!carteira) {
          carteira = await CarteiraGateway.getByPrestadorId(user!.id).catch(() => null);
        }

        // Busca transações: combina as do usuário como contratante e como prestador
        const [txUsuario, txPrestador] = await Promise.all([
          TransacaoGateway.getByUserId(user!.id).catch(() => [] as import("@/types/entities/transacao").Transacao[]),
          TransacaoGateway.getByPrestadorId(user!.id).catch(() => [] as import("@/types/entities/transacao").Transacao[]),
        ]);

        // Deduplica por id
        const porId = new Map<string, import("@/types/entities/transacao").Transacao>();
        [...(txUsuario ?? []), ...(txPrestador ?? [])].forEach((t) => porId.set(t.id, t));
        const transacoes = Array.from(porId.values())
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setCarteira(carteira);
        setTransacoes(transacoes);
      } catch (err: any) {
        setErro(err.message || "Erro ao carregar dados financeiros");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [user?.id]);

  return { carteira, transacoes, loading, erro };
}
