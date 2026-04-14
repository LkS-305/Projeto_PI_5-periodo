import {CriarUsuarioDto, AtualizarUsuarioDto } from '../../dtos/usuario';
import { Usuario } from '../../entities/Usuario';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IUsuarioRepository } from '../../repositories/IUsuarioRepository';

export class CriarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository, private userRepository: IUserRepository) {}

  async executar(dados: CriarUsuarioDto): Promise<Usuario> {
    const userExistente = await this.userRepository.findById(dados.user_id);

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

  async executar(user_id: string): Promise<void>{
    const usuario = await this.usuarioRepository.findByUserId(user_id);

    if (!usuario) {
      throw new Error('Usuario nao encontrado');
    }

    await this.usuarioRepository.delete(user_id);
  }
}

export class AtualizarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository){}

  async executar(dados: AtualizarUsuarioDto): Promise<void>{
    const usuario = await this.usuarioRepository.findByUserId(dados.user_id);
    if (!usuario) {
      throw new Error('Usuario nao existe para ser atualizado');
    }

    usuario.atualizarPerfil(dados);
    await this.usuarioRepository.update(usuario);
  }
}


export class PesquisarPorUserId {
  constructor(private usuarioRepository: IUsuarioRepository) {}
  
  async executar(user_id: string): Promise<Usuario | null>{
    const usuario = await this.usuarioRepository.findByUserId(user_id);

    if (!usuario) {
      throw new Error('Nao existe usuario com este id');
    }

    return usuario;
  }
}




