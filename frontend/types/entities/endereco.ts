 export interface Endereco{ 
   id: string,
   user_id: string,
   rotulo: string, // Ex: "Casa", "Trabalho", "Local do Evento"
   logradouro: string,
   numero: string,
   complemento?: string,
   bairro: string,
   cidade: string,
   estado: string, // UF
   cep: string,
   is_principal: boolean,
 }
