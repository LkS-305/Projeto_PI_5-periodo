import { Documento } from '../entities/Documento';
import { verificacaoStatus } from '../dtos/documento';

export interface IDocumentoRepository {
  create(documento: Documento): Promise<void>;
  update(documento: Documento): Promise<void>;
  delete(id: string): Promise<void>;
  findByUserId(user_id: string): Promise<Documento | null>;
  updateStatus(id: string, status: verificacaoStatus): Promise<void>;
}
