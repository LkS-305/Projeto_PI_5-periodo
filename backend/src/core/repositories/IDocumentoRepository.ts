import { Documento } from '../entities/Documento';


export interface IDocumentoRepository {
  save(documento: Documento): Promise<void>;
  findByUserId(id: string): Promise<Documento | null>;
  updateStatus(id: string, status: string): Promise<void>;
}
