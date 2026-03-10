export class AuditLog {
  public readonly id?: string;
  public usuario_id?: string; // Pode ser nulo se for uma ação de visitante
  public acao!: string;       // Ex: "UPDATE_PRECO", "LOGIN_FAIL"
  public recurso!: string;    // Tabela ou Entidade afetada
  public recurso_id?: string; // ID do registro alterado
  public dados_anteriores?: object; // JSON com o estado antes da mudança
  public dados_novos?: object;      // JSON com o estado depois da mudança
  public ip_origem!: string;
  public user_agent?: string; // Navegador/App que realizou a ação
  public created_at?: Date;

  constructor(props: Omit<AuditLog, 'id' | 'created_at'>, id?: string) {
    Object.assign(this, props);
    this.id = id;
  }
}
