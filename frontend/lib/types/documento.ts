export type DocumentoTipo = "RG" | "CNH" | "Antecedentes";
export type DocumentoStatus = "pendente" | "aprovado" | "rejeitado";

export interface Documento {
  id?: string;
  usuario_id: string;
  tipo: DocumentoTipo;
  numero_documento: string;
  arquivo_url: string;
  selfie_url: string;
  data_expiracao?: string;
  status: DocumentoStatus;
}

export interface CriarDocumentoDto {
  usuario_id: string;
  tipo: DocumentoTipo;
  numero_documento: string;
  arquivo_url: string;
  selfie_url: string;
  data_expiracao?: string;
}
