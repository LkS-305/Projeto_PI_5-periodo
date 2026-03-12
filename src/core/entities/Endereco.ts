export class Endereco {
  public readonly id?: string;
  public usuario_id!: string;
  public rotulo!: string; // Ex: "Casa", "Trabalho", "Local do Evento"
  public logradouro!: string;
  public numero!: string;
  public complemento?: string;
  public bairro!: string;
  public cidade!: string;
  public estado!: string; // UF
  public cep!: string;
  public latitude!: number;
  public longitude!: number;
  public is_principal: boolean = false;

  constructor(props: Omit<Endereco, 'id'>, id?: string) {
    Object.assign(this, props);
    this.id = id;
  }
}
