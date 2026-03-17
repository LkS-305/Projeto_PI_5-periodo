import { v4 as uuidv4 } from 'uuid';

import { TransacaoStatus, TransacaoType, MetodosPagamento } from '../dtos/transacao';


export class Transacao {
  readonly id: string;
  public servico_id: string;
  public tipo: TransacaoType;
  public status: TransacaoStatus;
  public valor: string;
  public descricao?: string;
  public metodo_pagamento: MetodosPagamento;
  public readonly created_at?: Date; 
  public updated_at?: Date;

constructor(props: Omit<Transacao, 'id' | 'created_at' | 'updated_at'>){
    this.id = uuidv4();
    this.servico_id = props.servico_id;
    this.tipo = props.tipo;
    this.status = props.status;
    this.valor = props.valor;
    this.metodo_pagamento = props.metodo_pagamento;
  }
}
