import { randomUUID } from "crypto";
import { CriarDocumentoDto } from "../dtos/documento";

export class Documento {
  public readonly id: string;
  public user_id: string;
  public tipo: "RG" | "CNH" | "Antecedentes";
  public numero_documento: string;
  public arquivo_url: string;
  public selfie_url: string;
  public data_expiracao: Date;
  public status: "pendente" | "aprovado" | "rejeitado";

  constructor(props: CriarDocumentoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.user_id = props.user_id;
    this.tipo = props.tipo;
    this.numero_documento = props.numero_documento;
    this.arquivo_url = props.arquivo_url;
    this.selfie_url = props.selfie_url;
    this.data_expiracao = props.data_expiracao;
    this.status = "pendente";
  }
}
