import { Transacao } from '../entities/Transacao';

export interface ITransacaoRepository {
  save(transacao: Transacao): Promise<void>;
  findByCarteiraId(id: string): Promise<Transacao | null>;
  updateStatus(id: string, satus: string): Promise<void>;
}
