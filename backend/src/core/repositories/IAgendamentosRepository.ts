import { Agendamento } from '../entities/Agendamento';


export interface IAgendamentosRepository {
  create(agendamento: Agendamento, transaction?: any): Promise<Agendamento>;
  delete(id: string): Promise<void>;
  update(id: string, agendamento: Partial<Agendamento>): Promise<Agendamento | null>;
  findById(id: string): Promise<Agendamento | null>;
  findByUserId(user_id: string): Promise<Agendamento[] | null>; 
  findByPrestadorId(prestador_id: string): Promise<Agendamento[] | null>;
}
