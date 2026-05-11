import { destinatario } from '../dtos/avaliacao';
export interface Avaliacao {  
 id: string;
 servico_id: string | undefined;
 usuario_id: string | undefined;
 prestador_id: string | undefined;
 destinatario: destinatario;
 nota: number;
 comentario: string | undefined;
 media: string | undefined;
 created_at: Date;
 upadted_at: Date;
}
