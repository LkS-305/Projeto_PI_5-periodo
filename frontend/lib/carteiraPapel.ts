export type CarteiraPapel = "cliente" | "prestador";

export function resolveCarteiraPapelFromQuery(
  raw: string | null,
  hubActiveTab: "contratante" | "profissional" | undefined,
): CarteiraPapel {
  if (raw === "prestador" || raw === "profissional") return "prestador";
  if (raw === "cliente" || raw === "contratante") return "cliente";
  if (hubActiveTab === "profissional") return "prestador";
  return "cliente";
}
