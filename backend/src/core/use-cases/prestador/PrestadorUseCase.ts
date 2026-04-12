import { IPrestadorRepository } from "../../repositories/IPrestadorRepository";
import { Prestador } from "../../entities/Prestador";
import { AtualizarPrestadorDto, CriarPrestadorDto } from "../../dtos/prestador";
import { IUserRepository } from "../../repositories/IUserRepository";

export class CriarPrestadorUseCase {
  constructor(
    private userRepository: IUserRepository,
    private prestadorRepository: IPrestadorRepository,
  ) {}

  async executar(dados: CriarPrestadorDto) {
    // 1. Tenta buscar um usuário com esse e-mail
      const usuarioExistente = await this.userRepository.findById(dados.user_id);


    if (!usuarioExistente) {
        throw new Error("Este User nao existe.");
      }
      let prestador: Prestador;

      prestador = new Prestador({
        user_id: dados.user_id,
        nome: dados.nome,
        bio: dados.bio,
        score: 0,
      }); 

    const prestadorCriado = await this.prestadorRepository.create(prestador);

    return prestadorCriado;
  }
}

export class DeletarPrestadorUseCase {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(user_id: string) {
    const prestador = await this.prestadorRepository.findByUserId(user_id);

    if (!prestador) {
      throw new Error("Prestador não encontrado");
    }

    return await this.prestadorRepository.delete(user_id);
  }
}

export class AtualizarPrestadorUseCase {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(prestador: AtualizarPrestadorDto) {
    const prestadorExistente = await this.prestadorRepository.findByUserId(prestador.user_id);

    if (!prestadorExistente) {
      throw new Error("Prestador não encontrado");
    }

    prestadorExistente.atualizarPerfil(prestador);
    const prestadorAtualizado = await this.prestadorRepository.update(prestadorExistente);

    if (!prestadorAtualizado) {
      throw new Error("Erro ao atualizar prestador");
    }

    return prestadorAtualizado;
  }
}

export class AcharPorUserId {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(user_id: string) {
    const prestador = await this.prestadorRepository.findByUserId(user_id);

    if (!prestador) {
      throw new Error("Nenhum prestador pertence a essa categoria");
    }

    return prestador;
  }
}


