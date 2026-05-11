export type ServicoStatus = 'criado' | 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';

export interface CriarServicoDto {
    user_id: string,
    prestador_id: string,
    categoria_id: string,
    titulo: string,
    preco_acordado: number,
    status: ServicoStatus
}

export interface AtualizarServicoDto {
    user_id: string,
    prestador_id: string,
    categoria_id: string,
    titulo: string,
    preco_acordado: number,
    status: ServicoStatus
}

