import { randomUUID } from "crypto";

export class AuditLog {
  public readonly id: string;
  public user_id: string; 
  public acao: string;     
  public recurso: string;  
  public recurso_id: string; 
  public dados_anteriores?: object; 
  public dados_novos?: object;
  public ip_origem?: string;
  public user_agent?: string; 
  public readonly created_at: Date;

  constructor(props: AuditLog) {
    this.id = props.id ?? randomUUID();
    this.user_id = props.user_id;
    this.acao = props.acao;
    this.recurso = props.recurso;
    this.recurso_id = props.recurso_id;
    this.dados_anteriores = props.dados_anteriores;
    this.dados_novos = props.dados_novos;
    this.ip_origem = props.ip_origem;
    this.user_agent = props.user_agent;
    this.created_at = new Date();
  }
}
