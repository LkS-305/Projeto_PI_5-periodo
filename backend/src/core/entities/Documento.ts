import { AtualizarDocumentoDto, CriarDocumentoDto, tipoDocumento, verificacaoStatus } from "../dtos/documento";
import { randomUUID } from "crypto";

export class Documento {
  public id: string;
  public user_id: string;
  public tipo: tipoDocumento;
  public numero_documento?: string;
  public arquivo_url: string;
  public selfie_url: string;
  public data_expiracao?: Date;
  public status: verificacaoStatus;

  constructor(props: CriarDocumentoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.user_id = props.user_id;
    this.tipo = props.tipo;
    this.numero_documento = props.numero_documento;
    this.arquivo_url = props.arquivo_url;
    this.selfie_url = props.selfie_url;
    this.data_expiracao = props.data_expiracao;
    this.status = props.status ?? 'aprovado';
  }

  atualizarDocumento(dados: AtualizarDocumentoDto): void {
    this.tipo = dados.tipo ?? this.tipo;
    this.numero_documento = dados.numero_documento ?? this.numero_documento;
    this.arquivo_url = dados.arquivo_url ?? this.arquivo_url;
    this.selfie_url = dados.selfie_url ?? this.selfie_url;
    this.data_expiracao = dados.data_expiracao ?? this.data_expiracao;
    this.status = dados.status ?? this.status;
  }

  atualizarStatus(novoStatus: verificacaoStatus): void {
    this.status = novoStatus;
  }
}
