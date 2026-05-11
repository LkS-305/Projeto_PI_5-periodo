import { ServicoStatus } from "../dtos/servico";

export interface Servico {
   readonly id?: string;
   user_id: string;      // FK para Usuário (Cliente)
   prestador_id: string; // FK para Prestador
   categoria_id: string;
   titulo: string;
   preco_acordado: number;
   status: ServicoStatus;
   nota_usuario: number | undefined;
   nota_prestador: number | undefined;
   nota: number | undefined;
   created_at: Date;
   updated_at: Date;
}
