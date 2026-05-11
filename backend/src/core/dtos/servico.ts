export type ServicoStatus = 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';

export interface CriarServicoDto {
    user_id: string,
    prestador_id: string,
    categoria_id: string,
    titulo: string,
    descricao: string,
    preco_acordado: number,
    data_inicio: Date,
    duracao: string,
    categoria: string
    status: ServicoStatus
}

