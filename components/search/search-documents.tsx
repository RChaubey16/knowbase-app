"use client";

import { useState } from "react";
import { SearchInput } from "@/components/search/search-input";
import { SearchResults } from "@/components/search/search-results";
import { SearchResult } from "@/types/search-result";
import { useSearch } from "@/lib/hooks/use-search";


export default function SearchDocuments({
  organisationSlug,
  workspaceSlug,
}: {
  organisationSlug: string;
  workspaceSlug: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { results, isLoading } = useSearch(
    workspaceSlug,
    organisationSlug,
    searchQuery
  );

  const handleSearch = () => {
    const normalizedQuery = inputValue.trim().toLowerCase();
    if (!normalizedQuery) return;
    setSearchQuery(normalizedQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    // TODO: Navigate to document detail page
    console.log("Clicked result:", result);
  };

  // Filter results client-side if needed (keeping original logic)
  const filteredResults = results.filter((result) => {
    const title = result?.title?.toLowerCase() ?? "";
    const snippet = result?.snippet?.toLowerCase() ?? "";
    const normalizedQuery = searchQuery.toLowerCase();
    return (
      title.includes(normalizedQuery) || snippet.includes(normalizedQuery)
    );
  });

  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section with Search Input */}
      <section className="w-full px-6 py-12 bg-linear-to-b from-muted/30 to-background">
        <div className="max-w-5xl mx-auto">
          <SearchInput
            value={inputValue}
            onChange={setInputValue}
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
            results={filteredResults}
            searchQuery={searchQuery}
            isLoading={isLoading}
            hasSearched={searchQuery !== ""}
            onResultClick={handleResultClick}
          />
        </div>
      </section>
    </main>
  );
}
