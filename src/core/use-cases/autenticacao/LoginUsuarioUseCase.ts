import { User } from '../../entities/User.ts';
import { IUserRepository } from '../../repositories/IUserRepository.ts';
import bycrpt from 'bcrypt';


export class LoginUsuarioUseCase {
  constructor(private usuarioRepository: IUserRepository){}

  async executar(dados: any){
    
  }
}
