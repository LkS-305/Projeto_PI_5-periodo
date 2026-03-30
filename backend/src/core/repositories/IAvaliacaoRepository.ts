import { Avaliacao } from '../entities/Avaliacao';
import { CriarAvaliacaoDto, ListBy } from '../dtos/avaliacao';

export interface IAvaliacaoRepository {
  create(avaliacao: CriarAvaliacaoDto): Promise<Avaliacao | null>;
  delete(id: string): Promise<void>;
  update(id: string, avaliacao: Partial<CriarAvaliacaoDto>): Promise<Avaliacao | null>;
  listBy(id: string, listBy: ListBy): Promise<Avaliacao[] | null>;
}

