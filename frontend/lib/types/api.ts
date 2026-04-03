// User/Authentication Types
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  fotoPerfil?: string;
  cpf?: string;
  documentoVerificado: boolean;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Prestador {
  id: string;
  usuarioId: string;
  descricao?: string;
  avaliacaoMedia: number;
  numeroAvaliacoes: number;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Endereco Types
export interface Endereco {
  id: string;
  usuarioId: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
  dataCriacao: string;
}

// Servico Types
export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  ativo: boolean;
  dataCriacao: string;
}

export interface Servico {
  id: string;
  prestadorId: string;
  categoriaId: string;
  titulo: string;
  descricao: string;
  preco: number;
  duracao?: number; // em minutos
  ativo: boolean;
  categoria?: Categoria;
  prestador?: Prestador;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Agendamento Types
export interface Agendamento {
  id: string;
  servicoId: string;
  clienteId: string;
  prestadorId: string;
  dataHora: string;
  duracao: number;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
  observacoes?: string;
  servico?: Servico;
  cliente?: Usuario;
  prestador?: Prestador;
  dataCriacao: string;
}

// Transacao Types
export interface Transacao {
  id: string;
  carteiraId: string;
  agendamentoId?: string;
  tipo: 'CREDITO' | 'DEBITO';
  valor: number;
  descricao: string;
  status: 'PENDENTE' | 'CONCLUIDA' | 'FALHA';
  dataCriacao: string;
}

// Carteira Types
export interface Carteira {
  id: string;
  usuarioId: string;
  saldo: number;
  dataCriacao: string;
  dataAtualizacao: string;
  transacoes?: Transacao[];
}

// Avaliacao Types
export interface Avaliacao {
  id: string;
  prestadorId: string;
  clienteId: string;
  agendamentoId: string;
  nota: number; // 1-5
  comentario?: string;
  ativo: boolean;
  dataCriacao: string;
  cliente?: Usuario;
}

// Mensagem Types
export interface Mensagem {
  id: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  lida: boolean;
  dataCriacao: string;
  remetente?: Usuario;
}

// Notificacao Types
export interface Notificacao {
  id: string;
  usuarioId: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  dataCriacao: string;
}

// API Request/Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export interface SignUpRequest {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
}
