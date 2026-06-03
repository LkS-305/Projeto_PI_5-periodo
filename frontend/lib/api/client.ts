type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  cache?: RequestCache;
};

async function apiFetch<T>(
  endpoint: string,
  method: string,
  options: RequestOptions = {},
): Promise<T> {
  const { headers, body, params, cache } = options;

  // No cliente, pegamos o token de onde você o armazena (ex: cookies via js-cookie)
  // const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);

  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key]),
    );
  }

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      // ...(token && { 'Authorization': `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: cache || "default",
  };

  console.log("Enviando requisicao com url e config:", url, config);

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const errorBody = contentType.includes("application/json")
      ? await response.json().catch(() => ({}))
      : await response.text().catch(() => "");

    const errorMessage =
      typeof errorBody === "string"
        ? errorBody
        : errorBody.message ||
          errorBody.erro ||
          errorBody.error ||
          "Erro na requisição";

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();
  if (!responseText) {
    return undefined as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    return responseText as T;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, "GET", options),
  post: <T>(endpoint: string, body: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, "POST", { ...options, body }),
  put: <T>(endpoint: string, body: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, "PUT", { ...options, body }),
  patch: <T>(endpoint: string, body: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, "PATCH", { ...options, body }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, "DELETE", options),
};
