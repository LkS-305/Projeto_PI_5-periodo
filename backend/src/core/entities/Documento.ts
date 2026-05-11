import { AtualizarDocumentoDto, CriarDocumentoDto, tipoDocumento } from "../dtos/documento";
import { verificacaoStatus } from "../dtos/documento";

export class Documento {
  public user_id: string;
  public tipo: tipoDocumento;
  public documento_url: string;
  public selfie_url: string;
  public verificacaoStatus: verificacaoStatus;

  constructor(props: CriarDocumentoDto, id?: string) {
    this.user_id = props.user_id;
    this.tipo = props.tipo;
    this.documento_url = props.documento_url;
    this.selfie_url = props.selfie_url;
    this.verificacaoStatus = props.verificacaoStatus;
  }


  atualizarDocumento(dados: AtualizarDocumentoDto): void {
  }

  atualizarStatus(novoStatus: verificacaoStatus): void{
    this.verificacaoStatus = novoStatus;
  }
}
