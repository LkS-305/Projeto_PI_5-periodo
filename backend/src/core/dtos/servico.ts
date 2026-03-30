export interface CriarServicoDto {
    user_id: string,
    prestador_id: string,
    endereco_id: string,
    titulo: string,
    categoria: string
}

export type ServicoStatus = 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';
