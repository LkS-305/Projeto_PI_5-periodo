export interface ExploreCard {
  user_id: string;
  nome: string;
  score: number;
  foto_url: string | null;
  cidade: string | null;
  estado: string | null;
  portfolio: { url: string; tipo: string; ordem: number }[];
  tags: string[];
}

export interface ExploreCategoria {
  categoria_id: string;
  categoria: string;
  prestadores: ExploreCard[];
}

export interface IExploreRepository {
  buscarParaExplore(): Promise<ExploreCategoria[]>;
}
