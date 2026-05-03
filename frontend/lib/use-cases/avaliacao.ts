import { apiClient } from "@/lib/api/client";
import { AvaliarBy } from "@/types/dtos/avaliacao";
import { Avaliacao } from "@/types/entities/avaliacao";

export async function createAvaliacao(
  dado: Omit<Avaliacao, "id" | "created_at" | "updated_at">,
): Promise<Avaliacao> {
  const response = await apiClient.post<Avaliacao>("/avaliacao/criarAvaliacao", dado, );
  return response;
}

export async function updateAvaliacao(
  id: string,
  dados: Partial<Avaliacao>,
): Promise<Avaliacao> {
  const response = await apiClient.patch<Avaliacao>("/avaliacao/atualizar-avaliacao", { id, dados }, );
  return response;
}

export async function deleteAvaliacao(id: string): Promise<boolean> {
  await apiClient.delete<boolean>("/avaliacao/deletarAvaliacao", {    //NESSE CASO NÃO É NECESSÁRIO RETORNAR NADA, POIS SE A REQUISIÇÃO FOR BEM SUCEDIDA, SIGNIFICA QUE A AVALIAÇÃO FOI DELETADA
    params: { id },
  });               //O ERRO JÁ É TRATADO EM useAvaliacao, ENTÃO O RETORNO PODE SER SIMPLESMENTE UM BOOLEANO PARA INDICAR SUCESSO OU FALHA
  return true;
}

export async function listAvaliacoes(
  id: string,
  listBy: AvaliarBy,
): Promise<Avaliacao[]> {
  const response = await apiClient.get<Avaliacao[]>("/avaliacao/listarAvaliacoes",
    {
      params: { id, listBy }
    },
  );
  return response;
}
