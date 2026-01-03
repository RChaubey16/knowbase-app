import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  );
}

export { Skeleton };

export function DocumentCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 px-4 py-4 border-b border-border/40">
      <Skeleton className="h-5 w-[40%]" />
      <Skeleton className="h-5 w-[20%]" />
      <Skeleton className="h-5 w-[15%]" />
      <Skeleton className="h-5 w-[15%]" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="p-6 rounded-xl border-2 border-border/30 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center gap-4 pt-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function WorkspaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 h-full">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="pt-2">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
