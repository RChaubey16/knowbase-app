"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Ask your knowledge base…",
  autoFocus = true,
  className,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className={cn("relative w-full max-w-3xl mx-auto", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          autoFocus={autoFocus}
          className={cn(
            "h-14 pl-12 pr-12 text-base shadow-lg border-2 transition-all duration-200",
            "focus-visible:shadow-xl focus-visible:border-primary/50",
            "disabled:opacity-70 disabled:cursor-not-allowed",
            isLoading && "pr-12"
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
        )}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border font-mono">Enter</kbd> to search
      </p>
    </div>
  );
}
