import { Documento } from "../../entities/Documento";
import { IDocumentoRepository } from "../../repositories/IDocumentoRepository";
import {
  AtualizarDocumentoDto,
  CriarDocumentoDto,
  verificacaoStatus,
} from "../../dtos/documento";
import { IUsuarioRepository } from "../../repositories/IUsuarioRepository";
import { ResourceNotFoundError } from "../../errors/AppError";
import { validarUUID } from "../../utils/validate";

export class CriarDocumentoUseCase {
  constructor(
    private documentoRepository: IDocumentoRepository,
    private usuarioRepository: IUsuarioRepository,
  ) {}

  async executar(dados: CriarDocumentoDto): Promise<Documento> {
    validarUUID(dados.user_id, "user_id");

    const usuario = await this.usuarioRepository.findByUserId(dados.user_id);
    if (!usuario) throw new ResourceNotFoundError("Usuário");

    // Caso o documento não informe validade, define um padrão (10 anos a partir de hoje)
    const dataExpiracao =
      dados.data_expiracao ??
      new Date(new Date().setFullYear(new Date().getFullYear() + 10));

    // Documento aprovado automaticamente
    const documento = new Documento({
      ...dados,
      data_expiracao: dataExpiracao,
      status: "aprovado",
    });
    await this.documentoRepository.create(documento);
    return documento;
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

    const documento = await this.documentoRepository.findByUserId(
      dados.user_id,
    );
    if (!documento) throw new ResourceNotFoundError("Documento");

    documento.atualizarDocumento(dados);
    await this.documentoRepository.update(documento);
    return documento;
  }
}

export class AcharPorUserId {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(id: string): Promise<Documento> {
    validarUUID(id, "ID do usuário");
    const documento = await this.documentoRepository.findByUserId(id);
    if (!documento) throw new ResourceNotFoundError("Documento");
    return documento;
  }
}

export class AtualizarStatus {
  constructor(private documentoRepository: IDocumentoRepository) {}

  async executar(id: string, novoStatus: verificacaoStatus): Promise<void> {
    validarUUID(id, "ID do documento");
    if (!["pendente", "aprovado", "rejeitado"].includes(novoStatus)) {
      throw new Error("Status inválido.");
    }
    await this.documentoRepository.updateStatus(id, novoStatus);
  }
}
