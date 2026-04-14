import client from "@/lib/api/client";
import { Avaliacao, AvaliarBy } from "@/lib/types";

export async function createAvaliacao(
  data: Omit<Avaliacao, "id" | "created_at" | "updated_at">,
): Promise<Avaliacao> {
  const response = await client.post<Avaliacao>(
    "/avaliacao/criarAvaliacao",
    data,
  );
  return response.data;
}

export async function updateAvaliacao(
  id: string,
  dados: Partial<Avaliacao>,
): Promise<Avaliacao> {
  const response = await client.get<Avaliacao>(
    "/avaliacao/atualizar-avaliacao",
    {
      params: { id, dados },
    },
  );
  return response.data;
}

export async function deleteAvaliacao(id: string): Promise<boolean> {
  const response = await client.get<boolean>("/avaliacao/deletarAvaliacao", {
    params: { id },
  });
  return response.data;
}

export async function listAvaliacoes(
  id: string,
  listBy: AvaliarBy,
): Promise<Avaliacao[]> {
  const response = await client.request<Avaliacao[]>({
    method: "get",
    url: "/avaliacao/listarAvaliacoes",
    data: { id, listBy },
  });
  return response.data;
}
