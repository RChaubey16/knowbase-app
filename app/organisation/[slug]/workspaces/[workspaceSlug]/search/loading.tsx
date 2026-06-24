import { Skeleton } from "@/components/ui/skeleton";
import { SearchResultSkeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background animate-in fade-in duration-500">
      {/* Header with mode toggle */}
      <header className="shrink-0 w-full px-6 py-4 border-b border-border bg-card/10">
        <div className="max-w-5xl mx-auto flex justify-center">
          <Skeleton className="h-10 w-64 rounded-full" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-3xl mx-auto w-full space-y-10">
          {/* Title + subtitle */}
          <div className="space-y-3 text-center">
            <Skeleton className="h-9 w-56 mx-auto" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>

          {/* Search input */}
          <Skeleton className="h-14 w-full rounded-2xl" />

          {/* Result cards */}
          <div className="space-y-4">
            <SearchResultSkeleton />
            <SearchResultSkeleton />
            <SearchResultSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
