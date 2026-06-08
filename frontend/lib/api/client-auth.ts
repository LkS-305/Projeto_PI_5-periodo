/** Authorization Bearer a partir do token no browser (evita importar `next/headers` em Client Components). */
export function bearerFromStorage(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("authToken") ?? "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}
