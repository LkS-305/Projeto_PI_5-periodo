import { tipoDocumento, verificacaoStatus } from "../dtos/documento";

export interface Documento {
  id?: string;
  user_id: string;
  tipo: tipoDocumento;
  documento_url: string;
  selfie_url: string;
  verificacaoStatus: verificacaoStatus;
}

