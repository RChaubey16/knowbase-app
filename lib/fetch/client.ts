const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

let refreshPromise: Promise<void> | null = null;

async function refreshToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("REFRESH_FAILED");
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function clientFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;

  // Build URL
  const url = new URL(endpoint, API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  const res = await fetch(url.toString(), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    credentials: "include",
  });

  // Retry once on 401
  if (res.status === 401) {
    try {
      await refreshToken();

      const retryRes = await fetch(url.toString(), {
        ...rest,
        headers: {
          "Content-Type": "application/json",
          ...(headers || {}),
        },
        credentials: "include",
      });

      if (retryRes.status === 401) {
        window.location.href = "/login";
        throw new Error("UNAUTHORIZED");
      }

      if (!retryRes.ok) {
        throw new Error(`API_ERROR_${retryRes.status}`);
      }

      return retryRes.json();
    } catch {
      window.location.href = "/login";
      throw new Error("AUTH_FAILED");
    }
  }

  if (res.status === 204) {
    return true as T;
  }

  const data = await res.json();

  if (!res.ok) {
    // 🔑 Wrap backend message in a real Error
    throw new Error(data.message ?? "Request failed");
  }

  return data as T;
}
