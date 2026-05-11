export type verificacaoStatus =  'pendente' | 'aprovado' | 'rejeitado';
export type tipoDocumento = 'RG' | 'CNH' | 'Antecedentes';

export interface CriarDocumentoDto {
    user_id: string;
    tipo: tipoDocumento;
    documento_url: string,
    selfie_url: string,
    verificacaoStatus: verificacaoStatus
}
