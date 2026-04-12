import { randomUUID } from 'crypto';
import { RegisterDto } from '../dtos/autenticacao';

export class User {
  public readonly id: string;
  public email: string;
  public senha: string;
  public cpf: string;
  public recovery_token?: string;
  public recovery_token_expires?: Date;
  public readonly created_at: Date;
  public updated_at: Date;

   constructor(props: RegisterDto, id?: string) {
    this.id = id ?? randomUUID();
    this.email = props.email;
    this.senha = props.senha;
    this.cpf = props.cpf;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  public atualizarUsuario(props: Partial<User>): void{
this.email = props.email ?? this.email;
    this.senha = props.senha ?? this.senha;
    this.cpf = props.cpf ?? this.cpf;
    this.updated_at = new Date();
  }

  atualizarTokens(recovery_token: string, recovery_token_expires: Date): void{
    this.recovery_token = recovery_token;
    this.recovery_token_expires = recovery_token_expires;
    this.updated_at = new Date();
  }

}
