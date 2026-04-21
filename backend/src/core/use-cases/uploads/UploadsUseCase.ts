import { IDocumentoRepository } from "../../repositories/IDocumentoRepository";

export class SalvarDocumentosUseCase {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async execute(userId: string, paths: { documento: string; selfie: string }) {
    // Regra: se já existe documento, talvez você queira sobrescrever ou validar
  }
}
