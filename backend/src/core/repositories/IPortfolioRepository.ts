export interface PortfolioItem {
  id: string;
  prestador_id: string;
  url: string;
  tipo: 'imagem' | 'video';
  descricao?: string;
  ordem: number;
  created_at?: Date;
}

export interface IPortfolioRepository {
  create(item: Omit<PortfolioItem, 'created_at'>): Promise<PortfolioItem>;
  delete(id: string): Promise<string | null>;
  findById(id: string): Promise<PortfolioItem | null>;
  findByPrestadorId(prestador_id: string): Promise<PortfolioItem[]>;
  reordenar(items: { id: string; ordem: number }[]): Promise<void>;
  countByPrestadorId(prestador_id: string): Promise<number>;
}
