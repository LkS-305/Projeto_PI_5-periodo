"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { contractDetailPath } from "@/lib/routes";

/** Alias pedido no enunciado: redireciona para `/contracts/[id]`. */
export default function ContractInformacoesAliasPage() {
  const params = useParams();
  const router = useRouter();
  const servicoId = typeof params?.servicoId === "string" ? params.servicoId : "";

  useEffect(() => {
    if (!servicoId) return;
    router.replace(contractDetailPath(servicoId));
  }, [router, servicoId]);

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui", color: "#666" }}>
      A redirecionar para o contrato…
    </div>
  );
}
