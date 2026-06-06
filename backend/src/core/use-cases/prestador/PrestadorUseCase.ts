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
      foto_url: dados.foto_url,
    });


    await this.prestadorRepository.create(prestador);

    return prestador;
  }
}

export class DeletarPrestadorUseCase {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(user_id: string): Promise<boolean> {
    const prestador = await this.prestadorRepository.findByUserId(user_id);

    if (!prestador) {
      throw new ResourceNotFoundError('Prestador');
    }

    await this.prestadorRepository.delete(user_id);
    return true;
  }
}

export class AtualizarPrestadorUseCase {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(prestador: AtualizarPrestadorDto) {
    if (prestador.nome !== undefined) { validarTexto(prestador.nome, 'Nome', 2, 100); prestador.nome = sanitizarTexto(prestador.nome); }
    if (prestador.bio  !== undefined) { validarTexto(prestador.bio,  'Bio',  10, 500); prestador.bio  = sanitizarTexto(prestador.bio); }

    const prestadorExistente = await this.prestadorRepository.findByUserId(prestador.user_id);

    if (!prestadorExistente) {
      throw new ResourceNotFoundError('Prestador');
    }
    const prestadorInstanciado = new Prestador(prestadorExistente);
    prestadorInstanciado.atualizarPerfil(prestador);
    await this.prestadorRepository.update(prestadorInstanciado);

    return prestadorInstanciado;
  }
}

export class AcharPorUserId {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(user_id: string) {
    const prestador = await this.prestadorRepository.findByUserId(user_id);

    if (!prestador) {
      throw new ResourceNotFoundError('Prestador');
    }

    return prestador;
  }
}
