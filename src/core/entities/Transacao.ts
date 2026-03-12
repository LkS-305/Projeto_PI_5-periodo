export type TransacaoType = 'enviar' | 'receber';
export type TransacaoStatus = 'pendente' | 'aprovada' | 'cancelada' | 'reembolsada'


export class Transacao {
  public id?: string;
  public servico_id: string;
  public carteira_id_sender: string;
  public carteira_id_receiver: string;
  public tipo: TransacaoType;
  public status: TransacaoStatus;
  public valor: string;
  public descricao: string;
  public metodo_pagamento: string;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

constructor(props: Omit<Transacao, 'id' | 'created_at' | 'updated_at'>, id?: string){
    this.id = id;
    this.servico_id = props.servico_id;
    this.carteira_id_sender = props.carteira_id_sender;
    this.carteira_id_receiver = props.carteira_id_receiver;
    this.tipo = props.tipo;
    this.status = props.status;
    this.valor = props.valor;
    this.descricao = props.descricao;
    this.metodo_pagamento = props.metodo_pagamento;
  }
}
