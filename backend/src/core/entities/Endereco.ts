import { v4 as uuid } from 'uuid';
import { AtualizarEnderecoDto } from '../dtos/endereco';

export class Endereco {
  public readonly id?: string;
  public user_id: string;
  public rotulo: string; // Ex: "Casa", "Trabalho", "Local do Evento"
  public logradouro: string;
  public numero: string;
  public complemento?: string;
  public bairro: string;
  public cidade: string;
  public estado: string; // UF
  public cep: string;
  public latitude?: number;
  public longitude?: number;
  public is_principal: boolean = false;

  constructor(props: Omit<Endereco, 'id'>, id?: string) {
    this.id = id ?? uuid();
    this.user_id = props.user_id;
    this.rotulo = props.rotulo;
    this.logradouro = props.numero;
    this.numero = props.numero;
    this.bairro = props.bairro;
    this.cidade = props.cidade;
    this.estado = props.estado;
    this.cep = props.cep;
    this.is_principal = props.is_principal
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
}
