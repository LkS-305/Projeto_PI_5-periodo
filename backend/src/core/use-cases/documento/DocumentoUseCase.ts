import { Documento } from "../../entities/Documento";
import { IDocumentoRepository } from "../../repositories/IDocumentoRepository";
import {
  AtualizarDocumentoDto,
  CriarDocumentoDto,
  VerificacaoStatus,
} from "../../dtos/documento";
import { IUsuarioRepository } from "../../repositories/IUsuarioRepository";
import { ResourceNotFoundError } from "../../errors/AppError";
import { validarUUID, validarDataFutura } from "../../utils/validate";

export class CriarDocumentoUseCase {
  constructor(
    private documentoRepository: IDocumentoRepository,
    private usuarioRepository: IUsuarioRepository,
  ) {}

  async executar(dados: CriarDocumentoDto): Promise<Documento> {
    validarUUID(dados.user_id, "user_id");
    validarDataFutura(dados.data_expiracao, "Data de expiração");

    const usuario = await this.usuarioRepository.findByUserId(dados.user_id);

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
    validarUUID(id, "ID do documento");
    await this.documentoRepository.delete(id);
  }
}

export class AtualizarDocumentoUseCase {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(dados: AtualizarDocumentoDto): Promise<Documento> {
    validarUUID(dados.user_id, "user_id");

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
    validarUUID(id, "user_id");

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
    validarUUID(id, "ID do documento");

    if (!["pendente", "aprovado", "rejeitado"].includes(novoStatus)) {
      throw new Error("Status inválido.");
    }

    await this.documentoRepository.updateStatus(id, novoStatus);
  }
}
