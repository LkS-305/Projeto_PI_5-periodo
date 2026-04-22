import {CriarUsuarioDto, AtualizarUsuarioDto } from '../../dtos/usuario';
import { Usuario } from '../../entities/Usuario';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IUsuarioRepository } from '../../repositories/IUsuarioRepository';
import { ResourceNotFoundError } from '../../errors/AppError';
import { validarUUID, validarEmail } from '../../utils/validate';

export class CriarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository, private userRepository: IUserRepository) {}

  async executar(dados: CriarUsuarioDto): Promise<Usuario> {
    const userExistente = await this.userRepository.findById(dados.user_id ?? '');

    if (!userExistente) {
      throw new Error('User nao existe');
    }

    const usuario = new Usuario(dados);
    const usuarioCriado = await this.usuarioRepository.create(usuario);

    if (!usuarioCriado) {
      throw new Error('Erro ao criar usuario');
    }

    return usuarioCriado;
  }

}

export class DeletarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository){}

  async executar(id: string): Promise<boolean>{
    const existente = await this.usuarioRepository.findByUserId(id)
      ?? await this.usuarioRepository.findById(id);
    if (!existente) return false;
    await this.usuarioRepository.delete(id);
    return true;
  }
}

export class AtualizarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository){}

  async executar(id: string, usuario: Partial<Usuario>): Promise<void>{
    validarUUID(id, 'ID do usuário');
    await this.usuarioRepository.update(id, usuario);
  }
}


export class PesquisarPorUserId {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(id: string): Promise<Usuario | null>{
    validarUUID(id, 'ID do usuário');
    const usuario = await this.usuarioRepository.findByUserId(id);

    if (!usuario) {
      throw new ResourceNotFoundError('Usuário');
    }

    return usuario;
  }
}

export class PesquisarPorEmail {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(email: string | undefined): Promise<Usuario | null>{
    validarEmail(email ?? '');
    const usuario = await this.usuarioRepository.findByEmail(email ?? '');

    if (!usuario) {
      throw new ResourceNotFoundError('Usuário');
    }

    return usuario;
  }

}

// Alias kept for backward compatibility
export { PesquisarPorUserId as PesquisarPorId };