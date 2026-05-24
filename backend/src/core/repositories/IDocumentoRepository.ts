import { Documento } from "../entities/Documento";
import { VerificacaoStatus } from "../dtos/documento";

export interface IDocumentoRepository {
  create(documento: Documento): Promise<Documento>;
  update(documento: Documento): Promise<Documento>;
  delete(id: string): Promise<void>;
  findByUserId(id: string): Promise<Documento | null>;
  findPendentes(): Promise<any[]>;
  updateStatus(id: string, status: VerificacaoStatus): Promise<void>;
}