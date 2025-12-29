"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Clock } from "lucide-react";
import { SearchResult } from "@/types/search-result";
import { cn, timeAgo } from "@/lib/utils";

interface SearchResultCardProps {
  result: SearchResult;
  searchQuery?: string;
  onClick?: (result: SearchResult) => void;
}

export function SearchResultCard({
  result,
  searchQuery,
  onClick,
}: SearchResultCardProps) {
  console.log(`result`, result);

  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="bg-primary/20 text-foreground font-semibold px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card
      className={cn(
        "p-5 transition-all duration-200 cursor-pointer border-2",
        "hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5",
        "active:translate-y-0"
      )}
      onClick={() => onClick?.(result)}
    >
      <div className="space-y-3">
        {/* Document Title */}
        <h3 className="text-lg font-semibold text-foreground leading-tight flex items-start gap-2">
          <FileText className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
          <span className="flex-1">{result.title}</span>
        </h3>

        {/* Snippet */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {highlightText(result.snippet, searchQuery)}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="h-5 px-2 text-[10px] font-medium capitalize"
            >
              {result.type === "url" ? (
                <>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  URL
                </>
              ) : (
                <>
                  <FileText className="h-3 w-3 mr-1" />
                  Manual
                </>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Updated {timeAgo(result.updated_at)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
