export type CarteiraStatus = 'ativa' | 'bloqueada' | 'em_verificacao';

export type Cartao = {
    numero: string;
    validade: string;
    senha: string;
    nome: string;
}

export type PagamentosAceitados = {
    pix: string;
    cartoes: Cartao[];
    dinheiro: string;
}

export class Carteira {
  public id?: string;
  public usuario_id?: string;
  public prestador_id?: string;
  public saldo: string;
  public saldo_bloqueado?: string;
  public ultima_transacao_id?: string;
  public metodos_de_pagamento?: PagamentosAceitados;
  public stauts: CarteiraStatus;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  constructor(props: Omit<Carteira, 'id' | 'created_at' | 'updated_at'>, id?: string) {
    this.id = id;
    this.saldo = props.saldo;
    this.usuario_id = props.usuario_id;
    this.stauts = props.stauts;
    this.metodos_de_pagamento = props.metodos_de_pagamento;
  }
}
