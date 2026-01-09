"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { SearchInput } from "@/components/search/search-input";
import { SearchResults } from "@/components/search/search-results";
import { SearchResult } from "@/types/search-result";
import { useSearch } from "@/lib/hooks/use-search";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function SearchDocuments({
  organisationSlug,
  workspaceSlug,
}: {
  organisationSlug: string;
  workspaceSlug: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"simple" | "rag">("simple");
  const { results, isLoading } = useSearch(
    workspaceSlug,
    organisationSlug,
    searchQuery,
    searchMode
  );

  const handleSearch = () => {
    const normalizedQuery = inputValue.trim().toLowerCase();
    if (!normalizedQuery) return;
    setSearchQuery(normalizedQuery);
    // TODO: Use searchMode to determine which search endpoint to call
    console.log("Search mode:", searchMode);
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
      {/* Hero Section with Search Mode Toggle and Input */}
      <section className="w-full px-6 py-12 bg-linear-to-b from-muted/30 to-background">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search Mode Toggle */}
          <div className="flex justify-center">
            <ToggleGroup
              type="single"
              value={searchMode}
              onValueChange={(value) => {
                if (value) setSearchMode(value as "simple" | "rag");
              }}
              variant="outline"
              spacing={0}
              className="bg-card"
            >
              <ToggleGroupItem value="simple" aria-label="Simple search">
                <Search className="h-4 w-4" />
                <span>Simple Search</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="rag" aria-label="RAG AI search">
                <Sparkles className="h-4 w-4" />
                <span>RAG AI Search</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Search Input */}
          <SearchInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSearch}
            isLoading={isLoading}
            autoFocus={true}
            placeholder={
              searchMode === "simple"
                ? "Search your documents…"
                : "Ask your knowledge base with AI…"
            }
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
