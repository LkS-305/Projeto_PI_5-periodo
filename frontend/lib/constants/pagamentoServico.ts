import type { MetodoPagamentoApi } from "@/types/dtos/transacao";

/** Opções reais de cobrança (Asaas) ao pagar um serviço na conversa / contrato. */
export const OPCOES_PAGAMENTO_SERVICO: {
  id: MetodoPagamentoApi;
  label: string;
  descricao: string;
}[] = [
  {
    id: "Pix",
    label: "PIX",
    descricao: "QR Code ou copia e cola — confirmação rápida.",
  },
  {
    id: "Boleto",
    label: "Boleto",
    descricao: "Linha digitável e PDF; compensação em até alguns dias úteis.",
  },
  {
    id: "Credito",
    label: "Cartão / outros",
    descricao: "Abre a fatura no Asaas para pagar com cartão, PIX ou boleto (conforme a tua conta).",
  },
];
