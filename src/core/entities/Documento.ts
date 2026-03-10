export class Documento {
  public readonly id?: string;
  public usuario_id!: string;
  public tipo!: 'RG' | 'CNH' | 'Antecedentes';
  public numero_documento!: string;
  public arquivo_url!: string;
  public selfie_url!: string;
  public data_expiracao?: Date;
  public status: 'pendente' | 'aprovado' | 'rejeitado';

  constructor(props: Omit<Documento, 'id'>, id?: string) {
    Object.assign(this, props);
    this.status = props.status ?? 'pendente';
    this.id = id;
  }
}
