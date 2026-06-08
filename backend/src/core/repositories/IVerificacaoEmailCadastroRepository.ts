export type VerificacaoEmailCadastroRow = {
  email: string;
  codigo: string;
  expira_em: Date;
};

export interface IVerificacaoEmailCadastroRepository {
  upsert(email: string, codigo: string, expira_em: Date): Promise<void>;
  findByEmail(email: string): Promise<VerificacaoEmailCadastroRow | null>;
  deleteByEmail(email: string): Promise<void>;
}
