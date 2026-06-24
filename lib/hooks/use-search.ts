import useSWR, { SWRConfiguration } from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { SearchResult } from "@/types/search-result";

const EMPTY_RESULTS: SearchResult[] = [];

export function useSearch(
  workspaceSlug: string,
  organisationSlug: string,
  query: string,
  mode: string,
  options?: SWRConfiguration
) {
  const fetcher = (url: string) =>
    clientFetch<SearchResult[]>(url, {
      headers: {
        "X-Organisation": organisationSlug,
      },
    });

  const normalizedQuery = query.trim();
  
  const { data, error, isLoading, mutate } = useSWR(
    workspaceSlug && normalizedQuery
      ? `/workspaces/${workspaceSlug}/documents/search?q=${encodeURIComponent(
          normalizedQuery
        )}&mode=${mode}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      ...options,
    }
  );

  return {
    results: data ?? EMPTY_RESULTS,
    isLoading,
    isError: error,
    mutate,
  };
}
