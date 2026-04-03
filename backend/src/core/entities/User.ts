import { v4 as uuid } from "uuid";
export type UserType = "cliente" | "prestador" | "admin";

export class User {
  public id?: string;
  public nome: string;
  public email: string;
  public senha: string;
  public cpf: string;
  public score?: string;
  public tipo_usuario: UserType;
  public foto_url?: string;
  public created_at?: Date;
  public updated_at?: Date;
  public last_access?: Date;

  constructor(props: Omit<User, "id" | "created_at">, id?: string) {
    this.id = id || uuid();
    this.nome = props.nome;
    this.email = props.email;
    this.senha = props.senha;
    this.cpf = props.cpf;
    this.tipo_usuario = props.tipo_usuario;
  }
}
