"use client";

import { useRef, useState } from "react";
import { SearchInput } from "@/components/search/search-input";
import { SearchResults } from "@/components/search/search-results";
import { SearchResult } from "@/types/search-result";
import { clientFetch } from "@/lib/fetch/client";

// Mock data for demonstration - replace with actual API call
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    documentId: 1,
    title: "Getting Started with Vector Databases",
    snippet:
      "Vector databases are specialized database systems designed to store and query high-dimensional vectors efficiently. They are essential for modern AI applications, enabling semantic search, recommendation systems, and similarity matching at scale.",
    type: "url",
    updated_at: "2025-12-20T10:30:00Z",
    rank: 0.95,
  },
  {
    id: "2",
    documentId: 2,
    title: "Knowledge Base Architecture Best Practices",
    snippet:
      "When building a knowledge base system, consider implementing a robust chunking strategy. Break documents into semantic units that maintain context while being small enough for efficient retrieval. Use overlapping chunks to prevent information loss at boundaries.",
    type: "manual",
    updated_at: "2025-12-19T14:20:00Z",
    rank: 0.87,
  },
  {
    id: "3",
    documentId: 3,
    title: "Semantic Search Implementation Guide",
    snippet:
      "Semantic search goes beyond keyword matching by understanding the meaning and context of queries. It uses embeddings to represent text in vector space, allowing for similarity-based retrieval that captures conceptual relationships between documents.",
    type: "url",
    updated_at: "2025-12-18T09:15:00Z",
    rank: 0.82,
  },
];

export default function SearchDocuments({
  organisationSlug,
  workspaceSlug,
}: {
  organisationSlug: string;
  workspaceSlug: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return;

    // Cancel previous request if still in flight
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await clientFetch(
        `/workspaces/${workspaceSlug}/documents/search?q=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            "X-Organisation": organisationSlug,
          },
          signal: controller.signal,
        }
      );

      if (!Array.isArray(res)) {
        throw new Error("Invalid search response");
      }

      const filteredResults = res.filter((result) => {
        const title = result?.title?.toLowerCase() ?? "";
        const snippet = result?.snippet?.toLowerCase() ?? "";
        return (
          title.includes(normalizedQuery) || snippet.includes(normalizedQuery)
        );
      });

      setResults(filteredResults);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Search failed:", err);
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // TODO: Navigate to document detail page
    console.log("Clicked result:", result);
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section with Search Input */}
      <section className="w-full px-6 py-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-5xl mx-auto">
          <SearchInput
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            isLoading={isLoading}
            autoFocus={true}
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="flex-1 w-full px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <SearchResults
            results={results}
            searchQuery={query}
            isLoading={isLoading}
            hasSearched={hasSearched}
            onResultClick={handleResultClick}
          />
        </div>
      </section>
    </main>
  );
}
