import { randomUUID } from 'crypto';
import {  UserType } from "../dtos/usuario";
import { RegisterDto } from '../dtos/autenticacao';

export class User {
  public readonly id: string;
  public nome: string;
  public email: string;
  public senha: string;
  public cpf: string;
  public score?: string;
  public tipo_usuario?: UserType;
  public foto_url?: string;
  public recovery_token?: string;
  public recovery_token_expires?: Date;
  public created_at?: Date;
  public updated_at?: Date;
  public last_access?: Date;

   constructor(props: Omit<RegisterDto, 'id' | 'created_at'>, id?: string) {
    this.id = id ?? randomUUID();
    this.nome = props.nome;
    this.email = props.email;
    this.senha = props.senha;
    this.cpf = props.cpf;
  }
} 
