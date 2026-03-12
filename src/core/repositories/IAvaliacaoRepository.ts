import { Avaliacao } from '../entities/Avaliacao';
import { AvaliarUPRequest, AvaliarPURequest, AvaliarServicoRequest } from '../dtos/avaliacao';

export interface IAvaliacaoRepository {
  create(avaliacao: Avaliacao): Promise<Avaliacao>;
  listByServico(servico_id: string): Promise<Avaliacao[] | null>;
  listByPrestador(prestador_id: string): Promise<Avaliacao[] | null>;
  listByUsuario(usuario_id: string): Promise<Avaliacao[] | null>;
  avaliarUsuario(avaliarUPRequest: AvaliarUPRequest): Promise<boolean>;
  avaliarPrestador(avaliarPURequest: AvaliarPURequest): Promise<boolean>;
  avaliarServico(avaliarServicoRequest: AvaliarServicoRequest): Promise<boolean>;
}

