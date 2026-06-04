export type ServicoStatus = 'criado' | 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';

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

export interface AtualizarServicoDto {
    id: string,
    titulo?: string,
    descricao?: string,
    preco_acordado?: number,
    data_inicio?: Date,
    duracao?: string,
    categoria?: string,
}

export interface AtualizarStatusServicoDto {
    id: string,
    status: ServicoStatus,
}

export interface ListarServicoDto {
    user_id?: string,
    prestador_id?: string,
    status?: ServicoStatus,
    categoria?: string,
}

export interface AvaliarServicoDto {
    nota_usuario?: number,
    nota_prestador?: number,
    nota?: number,
}
