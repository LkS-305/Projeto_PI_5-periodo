import { Documento } from '../entities/Documento';


export interface IDocumentoRepository {
  create(documento: Documento): Promise<void>;
  update(documento: Documento): Promise<void>;
  delete(id: string): Promise<void>;
  findByUserId(id: string): Promise<Documento | null>;
  updateStatus(id: string, status: string): Promise<void>;
}
