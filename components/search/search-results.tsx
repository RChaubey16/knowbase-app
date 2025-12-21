"use client";

import { SearchResult } from "@/types/search-result";
import { SearchResultCard } from "./search-result-card";
import { Search, FileQuestion } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
  hasSearched: boolean;
  onResultClick?: (result: SearchResult) => void;
}

export function SearchResults({
  results,
  searchQuery,
  isLoading,
  hasSearched,
  onResultClick,
}: SearchResultsProps) {
  // Initial state - before any search
  if (!hasSearched && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-sm">
          Search across your workspace knowledge
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-muted/30 rounded-lg border-2 border-border/50"
          />
        ))}
      </div>
    );
  }

  // No results state
  if (hasSearched && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No results found for this query
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Try different keywords or add more documents to your workspace.
        </p>
      </div>
    );
  }

  // Results state
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{results.length}</span> result{results.length !== 1 ? "s" : ""}
        </p>
      </div>
      {results.map((result) => (
        <SearchResultCard
          key={result.id}
          result={result}
          searchQuery={searchQuery}
          onClick={onResultClick}
        />
      ))}
    </div>
  );
}
