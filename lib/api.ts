const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
let refreshPromise: Promise<void> | null = null;

async function refreshTokens() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Refresh failed");
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  console.log(`IN REFRESH`);

  return refreshPromise;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    credentials: "include",
  });

  if (res.status !== 401) {
    return res;
  }

  // try refresh once
  try {
    await refreshTokens();
  } catch {
    // refresh failed → logout
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  // retry original request
  return fetch(`${API_BASE_URL}${input}`, {
    ...init,
    credentials: "include",
  });
}
