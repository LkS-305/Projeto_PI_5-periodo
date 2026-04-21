export interface CriarServicoDto {
    user_id: string,
    prestador_id: string,
    titulo: string,
    preco_acordado: number,
    data_inicio: Date,
    duracao: string,
    categoria: string
}

export type ServicoStatus = 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';
