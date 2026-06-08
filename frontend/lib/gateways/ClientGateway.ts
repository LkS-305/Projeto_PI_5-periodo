"use client";

import { apiClient } from "../api/client";
import type { Usuario } from "../../types/entities/usuario";
import type { Prestador } from "../../types/entities/prestador";
import type { Servico } from "../../types/entities/servico";
import type { Endereco } from "../../types/entities/endereco";
import type {
  CriarEnderecoDto,
  AtualizarEnderecoDto,
  RetornoApi,
} from "../../types/dtos/endereco";

// ──────────────────────────────────────────────────────────────────────────────
// Helpers de autenticação (token e usuário ficam no localStorage)
// ──────────────────────────────────────────────────────────────────────────────

export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("authToken") ?? "";
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("authUser");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? null;
  } catch {
    return null;
  }
}

export function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("authUser");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.email ?? null;
  } catch {
    return null;
  }
}

function authHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ──────────────────────────────────────────────────────────────────────────────
// Tipos de retorno do /explore (espelham o backend)
// ──────────────────────────────────────────────────────────────────────────────

export interface ExplorePortfolioItem {
  url: string;
  tipo: "imagem" | "video";
  ordem: number;
}

export interface ExploreCard {
  user_id: string;
  nome: string;
  score: number;
  foto_url?: string | null;
  cidade?: string | null;
  estado?: string | null;
  portfolio: ExplorePortfolioItem[];
  tags: string[];
}

export interface ExploreCategoria {
  categoria_id: string;
  categoria: string;
  prestadores: ExploreCard[];
}

export interface PortfolioItem {
  id: string;
  prestador_id: string;
  url: string;
  tipo: "imagem" | "video";
  descricao?: string | null;
  ordem: number;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  icon_url?: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Gateway client-side
// ──────────────────────────────────────────────────────────────────────────────

export const ClientGateway = {
  // Usuário (perfil base)
  async getUsuario(userId: string): Promise<Usuario | null> {
    return apiClient.post<Usuario | null>(
      "/usuario/buscarPorUserId",
      { user_id: userId },
      { headers: authHeader() },
    );
  },

  async atualizarUsuario(dados: { nome?: string; telefone?: string; url?: string }): Promise<Usuario> {
    return apiClient.patch<Usuario>("/usuario/editarUsuario", dados, {
      headers: authHeader(),
    });
  },

  async deletarUsuarioAtual(): Promise<unknown> {
    const id = getCurrentUserId();
    // Apaga a conta (tabela users). O cascade do banco remove o perfil relacionado.
    return apiClient.delete<unknown>("/user/deletarUser", {
      body: { id },
      headers: authHeader(),
    });
  },

  // Prestador (perfil profissional)
  async getPrestador(userId: string): Promise<Prestador | null> {
    return apiClient.post<Prestador | null>(
      "/prestador/buscarPorUserId",
      { user_id: userId },
      { headers: authHeader() },
    );
  },

  async createPrestador(nome: string, bio: string): Promise<Prestador> {
    return apiClient.post<Prestador>(
      "/prestador/criarPrestador",
      { nome, bio },
      { headers: authHeader() },
    );
  },

  async getCategorias(): Promise<Categoria[]> {
    const data = await apiClient.get<Categoria[] | null>("/categoria/buscarCategorias", {
      headers: authHeader(),
    });
    return data ?? [];
  },

  async createServico(dados: {
    user_id: string;
    prestador_id: string;
    categoria_id: string;
    categoria: string;
    titulo: string;
    descricao: string;
    preco_acordado: number;
    data_inicio: string;
    duracao: string;
  }) {
    return apiClient.post(
      "/servico/criarServico",
      { ...dados, status: "criado" },
      { headers: authHeader() },
    );
  },

  async addCategoriaPrestador(prestador_id: string, categoria_id: string): Promise<void> {
    await apiClient.post(
      "/prestador/categoria",
      { prestador_id, categoria_id },
      { headers: authHeader() },
    );
  },

  // Explore (público)
  async getExplore(): Promise<ExploreCategoria[]> {
    const data = await apiClient.get<ExploreCategoria[] | null>("/explore/");
    return data ?? [];
  },

  // Portfólio (público para leitura)
  async getPortfolio(prestadorId: string): Promise<PortfolioItem[]> {
    const data = await apiClient.get<PortfolioItem[] | null>("/portfolio/", {
      params: { prestador_id: prestadorId },
    });
    return data ?? [];
  },

  async uploadPortfolioItem(
    prestadorId: string,
    file: File,
    descricao?: string,
  ): Promise<PortfolioItem> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("prestador_id", prestadorId);
    if (descricao?.trim()) formData.append("descricao", descricao.trim());

    const url = `${process.env.NEXT_PUBLIC_API_URL}/portfolio/upload`;
    const res = await fetch(url, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.erro || err.message || "Erro ao enviar arquivo.");
    }
    return res.json();
  },

  async deletePortfolioItem(itemId: string, prestadorId: string): Promise<void> {
    const token = getAuthToken();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${itemId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ prestador_id: prestadorId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.erro || err.message || "Erro ao excluir item.");
    }
  },

  // Serviços
  async getServicosPorUser(userId: string): Promise<Servico[]> {
    const data = await apiClient.get<Servico[] | null>(
      "/servico/buscarPorUserId",
      { params: { id: userId }, headers: authHeader() },
    );
    return data ?? [];
  },

  async getServicosPorPrestador(prestadorId: string): Promise<Servico[]> {
    const data = await apiClient.get<Servico[] | null>(
      "/servico/buscarPorPrestadorId",
      { params: { id: prestadorId }, headers: authHeader() },
    );
    return data ?? [];
  },

  async getServicoById(servicoId: string): Promise<Servico | null> {
    return apiClient.get<Servico | null>("/servico/buscarPorId", {
      params: { id: servicoId },
      headers: authHeader(),
    });
  },

  async updateServicoStatus(
    servicoId: string,
    status: Servico["status"],
  ): Promise<void> {
    await apiClient.patch(
      "/servico/atualizarStatus",
      { id: servicoId, status },
      { headers: authHeader() },
    );
  },

  /** Estatísticas agregadas (serviços + transações na BD). */
  async getServicoStats(): Promise<{
    ativos: number;
    agendamentos_semana: number;
    receita_mensal: string | number;
    avaliacao_media: string | number | null;
  }> {
    return apiClient.get("/servico/stats", { headers: authHeader() });
  },

  async listarTodosServicos(): Promise<Servico[]> {
    const data = await apiClient.get<Servico[] | null>("/servico/listarTodos", {
      headers: authHeader(),
    });
    return data ?? [];
  },

  // Endereços
  async getEnderecos(userId: string): Promise<Endereco[]> {
    const data = await apiClient.get<Endereco[] | null>(
      "/endereco/acharPorUserId",
      { params: { id: userId }, headers: authHeader() },
    );
    return data ?? [];
  },

  async getEnderecoPrincipal(userId: string): Promise<Endereco | null> {
    const enderecos = await this.getEnderecos(userId);
    if (enderecos.length === 0) return null;
    return enderecos.find((e) => e.is_principal) ?? enderecos[0];
  },

  async criarEndereco(dados: CriarEnderecoDto): Promise<Endereco> {
    return apiClient.post<Endereco>("/endereco/criarEndereco", dados, {
      headers: authHeader(),
    });
  },

  async atualizarEndereco(id: string, dados: AtualizarEnderecoDto): Promise<Endereco> {
    return apiClient.patch<Endereco>(
      "/endereco/editarEndereco",
      { id, endereco: dados },
      { headers: authHeader() },
    );
  },

  // Consulta um CEP (preenche o endereço automaticamente)
  async buscarCep(cep: string): Promise<RetornoApi> {
    return apiClient.get<RetornoApi>("/endereco/buscarCep", {
      params: { cep },
      headers: authHeader(),
    });
  },
};
