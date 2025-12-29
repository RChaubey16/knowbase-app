export interface SearchResult {
  id: string;
  documentId: number;
  title: string;
  snippet: string;
  type: "url" | "manual";
  sourceUrl?: string;
  updated_at: string;
  rank?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  hasSearched: boolean;
}
