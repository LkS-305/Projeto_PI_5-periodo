import { Agendamento } from '../entities/Agendamento';


export interface IAgendamentoRepository {
  save(agenda: Agendamento): Promise<void>;
  findByPrestadorId(id: string): Promise<Agendamento | null>;
  delete(id: string): Promise<void>;
  update(id: string): Promise<Agendamento | null>;
   
}
