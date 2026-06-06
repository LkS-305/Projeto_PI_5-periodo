import { IMensagemRepository } from "../../repositories/IMensagemRepository";
import { EnviarMensagemDto, MarcarLidaDto } from "../../dtos/mensagem";
import { Mensagem } from "../../entities/Mensagem";
import { ValidationError, ResourceNotFoundError } from "../../errors/AppError";
import {
  validarUUID,
  validarTexto,
  sanitizarTexto,
} from "../../utils/validate";

export class EnviarMensagemUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(dados: EnviarMensagemDto): Promise<Mensagem> {
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
    return this.mensagemRepository.findByServicoId(servico_id);
  }
}

export class BuscarMensagensUsuarioUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(user_id: string): Promise<Mensagem[]> {
    return this.mensagemRepository.findByUserId(user_id) ?? [];
  }
}

export class BuscarMensagensPrestadorUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(prestador_id: string): Promise<Mensagem[]> {
    return this.mensagemRepository.findByPrestadorId(prestador_id) ?? [];
  }
}

export class MarcarMensagemLidaUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async executar(dados: MarcarLidaDto): Promise<void> {
    await this.mensagemRepository.marcarComoLida(
      dados.mensagem_id,
      dados.remetente_id,
    );
  }
}
