export type verificacaoStatus = 'pendente' | 'aprovado' | 'rejeitado';
export type tipoDocumento = 'RG' | 'CNH' | 'Antecedentes';

export interface CriarDocumentoDto {
  user_id: string;
  tipo: tipoDocumento;
  numero_documento?: string;
  arquivo_url: string;
  selfie_url: string;
  data_expiracao?: Date;
  status?: verificacaoStatus;
}

export interface AtualizarDocumentoDto {
  user_id: string;
  tipo?: tipoDocumento;
  numero_documento?: string;
  arquivo_url?: string;
  selfie_url?: string;
  data_expiracao?: Date;
  status?: verificacaoStatus;
}
