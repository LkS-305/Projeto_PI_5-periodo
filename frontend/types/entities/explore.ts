export interface ExplorePortfolioItem {
  url: string;
  tipo: string;
  ordem: number;
}

export interface ExploreCard {
  user_id: string;
  nome: string;
  score: number;
  foto_url: string | null;
  cidade: string | null;
  estado: string | null;
  portfolio: ExplorePortfolioItem[];
  tags: string[];
}

export interface ExploreCategoria {
  categoria_id: string;
  categoria: string;
  prestadores: ExploreCard[];
}
