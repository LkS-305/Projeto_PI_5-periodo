export interface CriarDocumentoDto {
    user_id: string;
    tipo: "RG" | "CNH" | "Antecedentes";
    numero_documento: string,
    arquivo_url: string,
    selfie_url: string,
    data_expiracao: Date
}
