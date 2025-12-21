export interface SearchResult {
  id: string;
  documentId: number;
  documentTitle: string;
  snippet: string;
  sourceType: "url" | "manual";
  sourceUrl?: string;
  updatedAt: string;
  relevanceScore?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  hasSearched: boolean;
}
