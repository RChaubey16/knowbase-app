// lib/fetch/server.ts
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.API_BASE_URL!;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;
  const cookieStore = await cookies();


  const organisationId = cookieStore.get("X-Organisation-Id")?.value;


  const url = new URL(endpoint, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }
  }

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  console.log("ORG ID HEADER", organisationId)

  const res = await fetch(url.toString(), {
    ...rest,
    headers: {
      Cookie: cookieHeader,
      ...(organisationId && {
        "X-Organisation-Id": organisationId,
      }),
      ...(headers || {}),
    },
    cache: rest.cache ?? "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }


  const data = await res.json();

  if (!res.ok) {
    // 🔑 Wrap backend message in a real Error
    throw new Error(data.message ?? "Request failed");
  }

  return data as T;
}
