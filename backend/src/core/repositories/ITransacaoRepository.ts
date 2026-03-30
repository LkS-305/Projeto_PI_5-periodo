import { Transacao } from '../entities/Transacao';

export interface ITransacaoRepository {
  create(transacao: Transacao, transaction?: any): Promise<Transacao>;
  delete(id: string): Promise<void>;
  update(id: string, transacao: Partial<Transacao>): Promise<Transacao | null>;
  findByServicoId(id: string): Promise<Transacao | null>;
  findByUserId(id: string): Promise<Transacao[] | null>;
  findByPrestadorId(id: string): Promise<Transacao[] | null>;
}
