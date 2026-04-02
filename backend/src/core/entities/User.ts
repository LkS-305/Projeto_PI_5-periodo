import { CriarUsuarioDto } from "../dtos/usuario";

export type UserType = 'cliente' | 'prestador' | 'admin';

export class User {
  public id?: string;
  public nome?: string;
  public email: string;
  public senha: string;
  public cpf?: string;
  public endereco?: string;
  public score?: number;            //PONTUAÇÃO MÉDIA DO USUÁRIO, CALCULADA A PARTIR DAS AVALIAÇÕES RECEBIDAS
  public tipo_usuario?: UserType;   // 'cliente' ou 'admin'
  public foto_url?: string;
  public created_at?: Date;
  public updated_at?: Date;
  public last_access?: Date;

   constructor(props: Omit<CriarUsuarioDto, 'id' | 'created_at'>, id?: string) {
    this.email = props.email;
    this.senha = props.senha;
  }
} 
