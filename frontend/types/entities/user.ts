export interface User {  
  id: string;
  email: string;
  cpf: string;
  recovery_token?: string;
  recovery_token_expires?: Date;
  created_at: Date;
  updated_at: Date;
}
