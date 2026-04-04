import { v4 as uuid } from 'uuid';

export class Prestador {
  public readonly id: string;
  public usuario_id: string;
  public bio: string;
  public scorePrestador?: number;
  public categories: string;
  public status_verificacao?: string;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: Omit<Prestador, 'id' | 'created_at'>, id?: string) {
    this.id = id ?? uuid();
    this.usuario_id = props.usuario_id;
    this.bio = props.bio;
    this.categories = props.categories;
  }
} 
