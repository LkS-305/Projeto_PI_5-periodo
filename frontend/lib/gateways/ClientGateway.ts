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

  // Serviços
  async getServicosPorUser(userId: string): Promise<Servico[]> {
    const data = await apiClient.get<Servico[] | null>(
      "/servico/buscarPorUserId",
      { params: { id: userId } },
    );
    return data ?? [];
  },

  async getServicosPorPrestador(prestadorId: string): Promise<Servico[]> {
    const data = await apiClient.get<Servico[] | null>(
      "/servico/buscarPorPrestadorId",
      { params: { id: prestadorId } },
    );
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
