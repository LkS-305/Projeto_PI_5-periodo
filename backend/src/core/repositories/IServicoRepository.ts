import { AtualizarStatusServicoDto, AtualizarServicoDto, CriarServicoDto } from '../dtos/servico';
import { Servico } from '../entities/Servico';

export interface IServicoRepository {
  create(servico: Servico, transaction?: any): Promise<Servico>;
  findAll(): Promise<Servico[]>;
  getStats(): Promise<{ ativos: number; agendamentos_semana: number; receita_mensal: string; avaliacao_media: string }>;
  findById(id: string): Promise<Servico | null>;
  findByUserId(id: string): Promise<Servico[] | null>;
  findByPrestadorId(id: string): Promise<Servico[] | null>;
  updateStatus(dado : AtualizarStatusServicoDto): Promise<void>;
  updateServico(dados : AtualizarServicoDto): Promise<void>;
}

