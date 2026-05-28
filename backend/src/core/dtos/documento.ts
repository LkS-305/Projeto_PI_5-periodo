export type VerificacaoStatus = "pendente" | "aprovado" | "rejeitado";
export type TipoDocumento = "RG" | "CNH" | "Antecedentes";

export interface CriarDocumentoDto {
  user_id: string;
  tipo: TipoDocumento;
  numero_documento: string;
  arquivo_url: string;
  selfie_url: string;
  data_expiracao: Date;
  status?: VerificacaoStatus;
}

export interface AtualizarDocumentoDto {
  user_id: string;
  tipo?: TipoDocumento;
  numero_documento?: string;
  arquivo_url?: string;
  selfie_url?: string;
  data_expiracao?: Date;
  status?: VerificacaoStatus;
}
