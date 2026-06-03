import { Mensagem } from "../entities/Mensagem";

export interface IMensagemRepository {
  save(mensagem: Mensagem): Promise<Mensagem>;
  findByServicoId(servico_id: string): Promise<Mensagem[]>;
  findByUserId(user_id: string): Promise<Mensagem[]>;
  findByPrestadorId(prestador_id: string): Promise<Mensagem[]>;
  marcarComoLida(mensagem_id: string, remetente_id: string): Promise<void>;
}
