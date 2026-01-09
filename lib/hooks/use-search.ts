import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { SearchResult } from "@/types/search-result";

export function useSearch(
  workspaceSlug: string,
  organisationSlug: string,
  query: string,
  mode: string
) {
  const fetcher = (url: string) =>
    clientFetch<SearchResult[]>(url, {
      headers: {
        "X-Organisation": organisationSlug,
      },
    });

  const normalizedQuery = query.trim();

  console.log(`mode`, mode)

  const { data, error, isLoading, mutate } = useSWR(
    workspaceSlug && normalizedQuery
      ? `/workspaces/${workspaceSlug}/documents/search?q=${encodeURIComponent(
          normalizedQuery
        )}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    results: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
