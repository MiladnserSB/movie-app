const BASE_URL = "http://localhost:4000/";

interface CustomRequestOptions extends RequestInit {
  body?: any;
  timeout?: number;
}

export async function request<T>(
  endpoint: string,
  options: CustomRequestOptions = {},
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${BASE_URL.replace(/\/$/, "")}/${cleanEndpoint}`;

  const { method = "GET", body, headers, timeout = 10000, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal: controller.signal,
    ...rest,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `HTTP Error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(
        "The request took too long. Is your backend server running?",
      );
    }
    throw error;
  }
}
