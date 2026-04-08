import { User } from '../../entities/User';
import { Usuario } from '../../entities/Usuario';
import { IUsuarioRepository } from '../../repositories/IUsuarioRepository';


export class DeletarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository){}

  async executar(id: string): Promise<void>{
    await this.usuarioRepository.delete(id);
  }
}

export class AtualizarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository){}

  async executar(id: string, usuario: Partial<Usuario>): Promise<void>{
    await this.usuarioRepository.update(id, usuario);
  }
}


export class PesquisarPorId {
  constructor(private usuarioRepository: IUsuarioRepository) {}
  
  async executar(id: string): Promise<Usuario | null>{
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error('Nao existe usuario com este id');
    }

    return usuario;
  }
}

export class PesquisarPorEmail {
  constructor(private usuarioRepository: IUsuarioRepository) {}
  
  async executar(id: string): Promise<Usuario | null>{
    const usuario = await this.usuarioRepository.findByEmail(id);

    if (!usuario) {
      throw new Error('Nao existe usuario com este email');
    }

    return usuario;
  }

}



