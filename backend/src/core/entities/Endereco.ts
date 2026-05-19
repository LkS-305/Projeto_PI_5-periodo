import { randomUUID } from 'crypto';
import { AtualizarEnderecoDto, CriarEnderecoDto } from '../dtos/endereco';

export class Endereco {
  public readonly id: string;
  public user_id: string;
  public rotulo: string; // "Casa", "Trabalho", "Local do Evento"
  public logradouro: string;
  public complemento?: string;
  public numero: string;
  public bairro: string;
  public cidade: string;
  public estado: string;
  public cep: string;
  public is_principal: boolean;
  public readonly created_at: Date;
  public updated_at: Date;

  constructor(props: CriarEnderecoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.user_id = props.user_id;
    this.rotulo = props.rotulo;
    this.logradouro = props.numero;
    this.numero = props.numero;
    this.bairro = props.bairro;
    this.cidade = props.cidade;
    this.estado = props.estado;
    this.cep = props.cep;
    this.is_principal = props.is_principal
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  public editEndereco(dados: AtualizarEnderecoDto) {
    this.rotulo = dados.rotulo ?? this.rotulo;
    this.logradouro = dados.logradouro ?? this.logradouro;
    this.numero = dados.numero ?? this.numero;
    this.bairro = dados.bairro ?? this.bairro;
    this.cidade = dados.cidade ?? this.cidade;
    this.estado = dados.estado ?? this.estado;
    this.cep = dados.cep ?? this.cep;
    this.is_principal = dados.is_principal ?? this.is_principal;
  }

  public setPrincipal(is_principal: boolean): void{
    this.is_principal = is_principal;
  }
}
