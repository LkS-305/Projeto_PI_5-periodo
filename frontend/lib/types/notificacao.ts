export type NotificacaoTipo = 'info' | 'sucesso' | 'alerta';

export interface Notificacao {
  id?: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  tipo: NotificacaoTipo;
  action_url?: string;
  data_leitura?: string;
  created_at?: string;
}

export interface CriarNotificacaoDto {
  usuario_id: string;
  titulo: string;
  mensagem: string;
  tipo: NotificacaoTipo;
  action_url?: string;
}
