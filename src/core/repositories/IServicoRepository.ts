import { CriarServicoDto } from '../dtos/servico';
import { Servico } from '../entities/Servico';

export interface IServicoRepository {
  create(servico: CriarServicoDto): Promise<Servico>;
  findById(id: string): Promise<Servico | null>;
  findByUserId(id: string): Promise<Servico[] | null>;
  findByPrestadorId(id: string): Promise<Servico[] | null>;
  updateStatus(id: string, status: string): Promise<void>;
}

