export type CartaoCadastroSalvo = {
  nomeTitular: string;
  ultimos4: string;
  validade: string;
};

export type BancoMockSalvo = {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta?: string;
};

export type CarteiraMetodosJson = {
  cartaoCadastro?: CartaoCadastroSalvo;
  bancoMock?: BancoMockSalvo;
};

export function parseCarteiraMetodos(raw: unknown): CarteiraMetodosJson {
  if (raw == null) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as CarteiraMetodosJson;
  }
  if (typeof raw === "string") {
    try {
      const o = JSON.parse(raw) as unknown;
      return typeof o === "object" && o !== null ? (o as CarteiraMetodosJson) : {};
    } catch {
      return {};
    }
  }
  return {};
}

export function stringifyMetodos(m: CarteiraMetodosJson): string {
  return JSON.stringify(m);
}
