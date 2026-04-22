import { IPrestadorRepository } from "../../repositories/IPrestadorRepository";
import { Prestador } from "../../entities/Prestador";
import { AtualizarPrestadorDto, CriarPrestadorDto } from "../../dtos/prestador";
import { IUserRepository } from "../../repositories/IUserRepository";
import { ResourceNotFoundError, ValidationError } from "../../errors/AppError";
import { validarUUID, validarTexto, sanitizarTexto } from "../../utils/validate";

export class CriarPrestadorUseCase {
  constructor(
    private userRepository: IUserRepository,
    private prestadorRepository: IPrestadorRepository,
  ) {}

  async executar(dados: CriarPrestadorDto) {
    validarUUID(dados.user_id, 'ID do usuário');
    validarTexto(dados.nome, 'Nome', 2, 100);
    validarTexto(dados.bio, 'Bio', 10, 500);
    dados.nome = sanitizarTexto(dados.nome);
    dados.bio  = sanitizarTexto(dados.bio);

    const usuarioExistente = await this.userRepository.findById(dados.user_id);

    if (!usuarioExistente) {
      throw new ResourceNotFoundError('Usuário');
    }

    const prestador = new Prestador({
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
    validarUUID(user_id, 'ID do usuário');
    const prestador = await this.prestadorRepository.findByUserId(user_id);

    if (!prestador) {
      throw new ResourceNotFoundError('Prestador');
    }

    await this.prestadorRepository.delete(user_id);
  }
}

export class AtualizarPrestadorUseCase {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(prestador: AtualizarPrestadorDto) {
    validarUUID(prestador.user_id, 'ID do usuário');
    if (prestador.nome !== undefined) { validarTexto(prestador.nome, 'Nome', 2, 100); prestador.nome = sanitizarTexto(prestador.nome); }
    if (prestador.bio  !== undefined) { validarTexto(prestador.bio,  'Bio',  10, 500); prestador.bio  = sanitizarTexto(prestador.bio); }

    const prestadorExistente = await this.prestadorRepository.findByUserId(prestador.user_id);

    if (!prestadorExistente) {
      throw new ResourceNotFoundError('Prestador');
    }

    prestadorExistente.atualizarPerfil(prestador);
    await this.prestadorRepository.update(prestadorExistente);

    return prestadorExistente;
  }
}

export class AcharPorUserId {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(user_id: string) {
    validarUUID(user_id, 'ID do usuário');
    const prestador = await this.prestadorRepository.findByUserId(user_id);

    if (!prestador) {
      throw new ResourceNotFoundError('Prestador');
    }

    return prestador;
  }
}
