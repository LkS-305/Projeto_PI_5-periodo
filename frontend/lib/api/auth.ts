export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("authToken") ?? "";
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
