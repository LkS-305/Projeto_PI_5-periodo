export interface AuditLog {
  id?: string;
  usuario_id?: string;
  acao: string;
  recurso: string;
  recurso_id?: string;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
  ip_origem?: string;
  user_agent?: string;
  created_at?: string;
}

export interface CriarAuditLogDto {
  usuario_id?: string;
  acao: string;
  recurso: string;
  recurso_id?: string;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
  ip_origem?: string;
  user_agent?: string;
}
