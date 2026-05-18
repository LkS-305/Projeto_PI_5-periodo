import { ServicoStatus } from "../entities/Servico";
import { Servico } from "../entities/Servico";

export interface CriarServicoDto {
    id: string,
    usuario_id: string,
    prestador_id: string,
    titulo: string,
    descricao?: string,
    preco_acordado: number,
    data_inicio: Date,
    duracao: string,
    categoria: string
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
    usuario_id?: string,
    prestador_id?: string,
    status?: ServicoStatus,
    categoria?: string,
}

export interface AvaliarServicoDto {
    nota_usuario?: number,
    nota_prestador?: number,
    nota?: number,
}