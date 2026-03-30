import { Mensagem } from '../entities/Mensagem';

export interface IMensagemRepository {
  save(mensagem: Mensagem): Promise<void>;
  findByUserId(id: string): Promise<Mensagem | null>
  findByPrestadorId(id: string): Promise<Mensagem | null>
  findByServicoId(id: string): Promise<Mensagem | null>
}
