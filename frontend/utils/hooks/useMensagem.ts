"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mensagem } from "@/types/entities/mensagem";
import { EnviarMensagemDto } from "@/types/dtos/mensagem";
import { MensagemGateway } from "@/lib/gateways/MensagemGateway";

const POLLING_INTERVAL_MS = 3000;

export function useMensagem(servico_id: string | null) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buscarMensagens = useCallback(async () => {
    if (!servico_id) return;
    try {
      const resultado = await MensagemGateway.listarPorServico(servico_id);
      setMensagens(resultado);
    } catch (err: any) {
      // Silencia erros de polling para não poluir a UI
      console.error("Erro ao buscar mensagens:", err?.message);
    }
  }, [servico_id]);

  // Carga inicial + polling
  useEffect(() => {
    if (!servico_id) return;

    setLoading(true);
    buscarMensagens().finally(() => setLoading(false));

    intervalRef.current = setInterval(buscarMensagens, POLLING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [servico_id, buscarMensagens]);

  const enviar = useCallback(
    async (dados: EnviarMensagemDto): Promise<Mensagem | null> => {
      setEnviando(true);
      setError(null);
      try {
        const nova = await MensagemGateway.enviar(dados);
        // Adiciona otimisticamente antes do próximo polling
        setMensagens((prev) => [...prev, nova]);
        return nova;
      } catch (err: any) {
        setError(err?.message || "Erro ao enviar mensagem");
        return null;
      } finally {
        setEnviando(false);
      }
    },
    [],
  );

  const marcarLida = useCallback(async (mensagem_id: string) => {
    try {
      await MensagemGateway.marcarComoLida(mensagem_id);
      setMensagens((prev) =>
        prev.map((m) =>
          m.id === mensagem_id
            ? { ...m, lida_em: new Date().toISOString() }
            : m,
        ),
      );
    } catch (err: any) {
      console.error("Erro ao marcar mensagem como lida:", err?.message);
    }
  }, []);

  return { mensagens, loading, enviando, error, enviar, marcarLida };
}
