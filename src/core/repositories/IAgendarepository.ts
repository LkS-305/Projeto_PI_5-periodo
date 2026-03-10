import { Agenda } from '../entities/Agenda';


export interface IAgendaRepository {
  save(agenda: Agenda): Promise<void>;
  findByPrestadorId(id: string): Promise<Agenda | null>;
  delete(id: string): Promise<void>;
  update(id: string): Promise<Agenda | null>;
   
}
