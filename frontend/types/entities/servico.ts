import { CriarServicoDto } from "../dtos/servico";
import { randomUUID } from "crypto";

export type ServicoStatus = 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';

export interface Servico {
  readonly id: string;
  user_id: string; // FK para Usuário (Cliente)
  prestador_id: string; // FK para Prestador
  titulo: string;
  preco_acordado: number;
  data_inicio: Date;
  duracao: string;
  categoria: string;
  status: ServicoStatus;
  nota_usuario?: number;
  nota_prestador?: number;
  nota?: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
