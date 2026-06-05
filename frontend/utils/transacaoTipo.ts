/** Alinha com o que a API pode gravar (ex.: receber/enviar ou crédito/débito legado). */

export function isEntradaTipo(tipo: string | undefined): boolean {
  const t = (tipo ?? "").toLowerCase();
  return t === "credito" || t === "receber" || t === "entrada";
}

export function isSaidaTipo(tipo: string | undefined): boolean {
  const t = (tipo ?? "").toLowerCase();
  return t === "debito" || t === "enviar" || t === "saida";
}
