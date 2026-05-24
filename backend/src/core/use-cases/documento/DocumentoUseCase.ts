import { Documento } from "../../entities/Documento";
import { IDocumentoRepository } from "../../repositories/IDocumentoRepository";
import {
  AtualizarDocumentoDto,
  CriarDocumentoDto,
  VerificacaoStatus,
} from "../../dtos/documento";
import { IUserRepository } from "../../repositories/IUserRepository";
import { ResourceNotFoundError } from "../../errors/AppError";
import { validarUUID } from "../../utils/validate";

export class CriarDocumentoUseCase {
  constructor(
    private documentoRepository: IDocumentoRepository,
    private userRepository: IUserRepository,
  ) {}

  async executar(dados: CriarDocumentoDto): Promise<Documento> {
    const usuario = await this.userRepository.findById(dados.user_id);

    if (!usuario) {
      throw new ResourceNotFoundError("Usuário");
    }

    const documento = new Documento({
      ...dados,
      status: dados.status ?? "pendente",
    });

    return await this.documentoRepository.create(documento);
  }
}

export class DeletarDocumentoUseCase {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(id: string): Promise<void> {
    await this.documentoRepository.delete(id);
  }
}

export class AtualizarDocumentoUseCase {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(dados: AtualizarDocumentoDto): Promise<Documento> {
    const documento = await this.documentoRepository.findByUserId(dados.user_id);

    if (!documento) {
      throw new ResourceNotFoundError("Documento");
    }

    documento.atualizarDocumento(dados);

    return await this.documentoRepository.update(documento);
  }
}

export class AcharPorUserId {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(id: string): Promise<Documento> {
    const documentoUsuario = await this.documentoRepository.findByUserId(id);

    if (!documentoUsuario) {
      throw new ResourceNotFoundError("Documento");
    }

    return documentoUsuario;
  }
}

export class ListarDocumentosPendentes {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(): Promise<any[]> {
    return await this.documentoRepository.findPendentes();
  }
}

export class AtualizarStatus {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(id: string, novoStatus: VerificacaoStatus): Promise<void> {
    if (!["pendente", "aprovado", "rejeitado"].includes(novoStatus)) {
      throw new Error("Status inválido.");
    }

    await this.documentoRepository.updateStatus(id, novoStatus);
  }
}