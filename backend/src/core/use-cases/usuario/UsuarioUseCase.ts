import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';


export class DeletarUsuarioUseCase {
  constructor(private usuarioRepository: IUserRepository){}

  async executar(id: string): Promise<boolean>{
    const usuarioDeletado = await this.usuarioRepository.delete(id);

    if (!usuarioDeletado){
      return false;
      //throw new Error('Usuario nao deletado');
    }

    return true;
  }
}

export class AtualizarUsuarioUseCase {
  constructor(private usuarioRepository: IUserRepository){}

  async executar(id: string, usuario: Partial<User>): Promise<User | null>{
    const usuarioAtualizado = await this.usuarioRepository.update(id, usuario);

    if (!usuarioAtualizado){
      throw new Error('Usuario nao atualizado');
    }

    return usuarioAtualizado;
  }
}

export class PesquisarPorId {
  constructor(private usuarioRepository: IUserRepository) {}
  
  async executar(id: string): Promise<User | null>{
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error('Nao existe usuario com este id');
    }

    return usuario;
  }
}

export class PesquisarPorEmail {
  constructor(private usuarioRepository: IUserRepository) {}
  
  async executar(id: string): Promise<User | null>{
    const usuario = await this.usuarioRepository.findByEmail(id);

    if (!usuario) {
      throw new Error('Nao existe usuario com este email');
    }

    return usuario;
  }

}



