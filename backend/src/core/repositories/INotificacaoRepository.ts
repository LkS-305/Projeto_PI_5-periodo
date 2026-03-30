import { Notificacao } from '../entities/Notificacao';

export interface INotificacaoRepository {
  save(notificacao: Notificacao): Promise<void>;
  findByServicoId(id: string): Promise<Notificacao | null>;
}
