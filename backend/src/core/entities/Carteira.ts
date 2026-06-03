import { CriarCarteiraDto } from "../dtos/carteira";

export type CarteiraStatus = 'ativa' | 'bloqueada' | 'em_verificacao';

export class Carteira {
  public user_id: string;
  public saldo: string;
  public saldo_bloqueado?: string;
  public numero_cartao: string;
  public validade_cartao: string;
  public nome_cartao: string;
  public vcc_cartao: string;
  public status: CarteiraStatus;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  constructor(props: CriarCarteiraDto) {
    this.user_id = props.user_id;  
    this.saldo = props.saldo;
    this.numero_cartao = props.numero_cartao;
    this.validade_cartao = props.validade_cartao;
    this.nome_cartao = props.nome_cartao;
    this.vcc_cartao = props.vcc_cartao;
    this.status = 'em_verificacao';
  }
}
