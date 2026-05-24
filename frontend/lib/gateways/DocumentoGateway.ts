import { apiClient } from "../api/client";

export type DocumentoStatus = "pendente" | "aprovado" | "rejeitado";

export type DocumentoPendente = {
  id: string;
  user_id: string;
  tipo: "RG" | "CNH" | "Antecedentes";
  numero_documento?: string;
  arquivo_url: string;
  selfie_url: string;
  status: DocumentoStatus;
  usuario_nome?: string;
  usuario_email?: string;
};

export const DocumentoGateway = {
  async enviarDocumentos(
    dados: {
      user_id: string;
      tipo: "RG" | "CNH" | "Antecedentes";
      numero_documento?: string;
      documento: File;
      selfie: File;
    },
    token?: string,
  ) {
    const formData = new FormData();

    formData.append("user_id", dados.user_id);
    formData.append("tipo", dados.tipo);
    formData.append("numero_documento", dados.numero_documento ?? "");
    formData.append("documento", dados.documento);
    formData.append("selfie", dados.selfie);

    return apiClient.post<DocumentoPendente>("/documento/upload", formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  async listarPendentes() {
    return apiClient.get<DocumentoPendente[]>("/documento/pendentes");
  },

  async atualizarStatus(id: string, status: DocumentoStatus) {
    return apiClient.patch(`/documento/${id}/status`, { status });
  },
};