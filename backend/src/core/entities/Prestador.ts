import { User } from './User';

export class Prestador extends User {
  public id?: string;
  public bio?: string;
  public scorePrestador: number;
  public categories?: string;
  public status_verificacao: string;

  constructor(props: Omit<Prestador, 'id' | 'created_at'>, id?: string) {
    super(props, id);
    this.bio = props.bio;
    this.scorePrestador = props.scorePrestador || 0;
    this.categories = props.categories;
    this.status_verificacao = props.status_verificacao;
  }
} 
