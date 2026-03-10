import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import bcrypt from 'bcrypt';

export class CriarUsuarioUseCase {
  constructor(private usuarioRepository: IUserRepository){}

  async executar(dados: any){
    const usuarioExiste = await this.usuarioRepository.findByEmail(dados.email);
    if (usuarioExiste){
        throw new Error('Este email ja existe');
    }

    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
    
    const novoUsuario = new User({...dados, senha: senhaCriptografada});

    const usuarioSalvo = await this.usuarioRepository.create(novoUsuario);

    const { senha, ...usuarioSemSenha } = usuarioSalvo;
    return usuarioSemSenha;
  }
}


export class DeletarUsuarioUseCase {
  constructor(private usuarioRepository: IUserRepository){}

  async executar(id: string): Promise<boolean>{
    const usuarioDeletado = await this.usuarioRepository.delete(id);

    if (!usuarioDeletado){
      throw new Error('Usuario nao deletado');
    }

    return true;
  }
}

export class PesquisarUsuarioUseCase {
  constructor(private usuarioRepository: IUserRepository) {}
  
  async executar(id: string): Promise<User | null>{
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error('Nao existe usuario com este id');
    }

    return usuario;
  }

}



