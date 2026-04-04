import { User } from "./User";
import { v4 as uuid } from "uuid";

export class Prestador extends User {
  public id: string;
  public user_id: string;
  public bio: string;
  public scorePrestador?: number;
  public status_verificacao?: string;

  constructor(props: Omit<Prestador, "id" | "created_at">, id?: string) {
    // Para criar um Prestador, passamos as propriedades do User + propriedades específicas
    super({
      nome: props.nome,
      email: props.email,
      senha: props.senha,
      cpf: props.cpf,
      tipo_usuario: props.tipo_usuario,
      score: props.score,
      foto_url: props.foto_url,
      updated_at: props.updated_at,
      last_access: props.last_access,
    });

    this.id = id || uuid();
    this.user_id = props.user_id;
    this.bio = props.bio;
  }

  // Método estático para criar Prestador a partir de um User existente
  static fromUser(
    user: User,
    prestadorProps: {
      bio: string;
    },
  ): Prestador {
    return new Prestador({
      // Propriedades do User
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      cpf: user.cpf,
      tipo_usuario: user.tipo_usuario,
      score: user.score,
      foto_url: user.foto_url,
      updated_at: user.updated_at,
      last_access: user.last_access,
      // Propriedades específicas do Prestador
      user_id: user.id!,
      bio: prestadorProps.bio,
    });
  }
}
