export type UserType = 'client' | 'prestador' | 'admin';

export class User {
  public id?: string;
  public nome: string;
  public email: string;
  public senha: string;
  public cpf: string;
  public endereco: string;
  public score: string;
  public tipo_usuario: UserType;
  public foto_url: string;
  public created_at?: Date;
  public updated_at?: Date;
  public last_access: Date;

   constructor(props: Omit<User, 'id' | 'created_at'>, id?: string) {
    this.nome = props.nome;
    this.cpf = props.cpf;
    this.endereco = props.endereco;
    this.email = props.email;
    this.senha = props.senha;
    this.tipo_usuario = props.tipo_usuario || 'cliente';
    this.foto_url = props.foto_url;
    this.id = id;
    this.score = props.score;
    this.last_access = props.last_access;
  }
} 
