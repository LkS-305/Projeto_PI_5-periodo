import { IMensagemRepository } from "../../repositories/IMensagemRepository";
import { EnviarMensagemDto, MarcarLidaDto } from "../../dtos/mensagem";
import { Mensagem } from "../../entities/Mensagem";
import { ValidationError, ResourceNotFoundError } from "../../errors/AppError";
import {
  validarId,
  validarUUID,
  validarTexto,
  sanitizarTexto,
} from "../../utils/validate";

export class EnviarMensagemUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(dados: EnviarMensagemDto): Promise<Mensagem> {
    validarId(dados.servico_id, "ID do serviço");
    validarId(dados.remetente_id, "ID do remetente");
    validarTexto(dados.conteudo, "Conteúdo", 1, 2000);

    dados.conteudo = sanitizarTexto(dados.conteudo);

    const mensagem = new Mensagem({
      servico_id: dados.servico_id,
      remetente_id: dados.remetente_id,
      conteudo: dados.conteudo,
      tipo_midia: dados.tipo_midia ?? "texto",
    });

    const salva = await this.mensagemRepository.save(mensagem);

    if (!salva) {
      throw new ValidationError("Falha ao enviar mensagem.");
    }

    return salva;
  }
}

export class BuscarMensagensServicoUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(servico_id: string): Promise<Mensagem[]> {
    validarUUID(servico_id, "ID do serviço");
    return this.mensagemRepository.findByServicoId(servico_id);
  }
}

export class BuscarMensagensUsuarioUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(user_id: string): Promise<Mensagem[]> {
    validarUUID(user_id, "ID do usuário");
    const mensagens = await this.mensagemRepository.findByUserId(user_id);

    if (!mensagens || mensagens.length === 0) {
      throw new ResourceNotFoundError("Mensagens do usuário");
    }

    return mensagens;
  }
}

export class BuscarMensagensPrestadorUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(prestador_id: string): Promise<Mensagem[]> {
    validarUUID(prestador_id, "ID do prestador");
    const mensagens =
      await this.mensagemRepository.findByPrestadorId(prestador_id);

    if (!mensagens || mensagens.length === 0) {
      throw new ResourceNotFoundError("Mensagens do prestador");
    }

    return mensagens;
  }
}

export class MarcarMensagemLidaUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(dados: MarcarLidaDto): Promise<void> {
    validarUUID(dados.mensagem_id, "ID da mensagem");
    validarId(dados.remetente_id, "ID do remetente");
    await this.mensagemRepository.marcarComoLida(
      dados.mensagem_id,
      dados.remetente_id,
    );
  }
}
