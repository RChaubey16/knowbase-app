"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { SearchInput } from "@/components/search/search-input";
import { SearchResults } from "@/components/search/search-results";
import { SearchResult } from "@/types/search-result";

// Mock data for demonstration - replace with actual API call
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    documentId: 1,
    documentTitle: "Getting Started with Vector Databases",
    snippet:
      "Vector databases are specialized database systems designed to store and query high-dimensional vectors efficiently. They are essential for modern AI applications, enabling semantic search, recommendation systems, and similarity matching at scale.",
    sourceType: "url",
    sourceUrl: "https://example.com/vector-db-guide",
    updatedAt: "2025-12-20T10:30:00Z",
    relevanceScore: 0.95,
  },
  {
    id: "2",
    documentId: 2,
    documentTitle: "Knowledge Base Architecture Best Practices",
    snippet:
      "When building a knowledge base system, consider implementing a robust chunking strategy. Break documents into semantic units that maintain context while being small enough for efficient retrieval. Use overlapping chunks to prevent information loss at boundaries.",
    sourceType: "manual",
    updatedAt: "2025-12-19T14:20:00Z",
    relevanceScore: 0.87,
  },
  {
    id: "3",
    documentId: 3,
    documentTitle: "Semantic Search Implementation Guide",
    snippet:
      "Semantic search goes beyond keyword matching by understanding the meaning and context of queries. It uses embeddings to represent text in vector space, allowing for similarity-based retrieval that captures conceptual relationships between documents.",
    sourceType: "url",
    sourceUrl: "https://example.com/semantic-search",
    updatedAt: "2025-12-18T09:15:00Z",
    relevanceScore: 0.82,
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock search logic - filter results based on query
    const filteredResults = mockSearchResults.filter(
      (result) =>
        result.documentTitle.toLowerCase().includes(query.toLowerCase()) ||
        result.snippet.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults);
    setIsLoading(false);
  };

  const handleResultClick = (result: SearchResult) => {
    // TODO: Navigate to document detail page
    console.log("Clicked result:", result);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar title="Search" indexStatus="ready" type="search" />

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
    </div>
  );
}
