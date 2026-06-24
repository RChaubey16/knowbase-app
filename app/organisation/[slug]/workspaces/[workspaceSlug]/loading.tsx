import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-3">
      <Skeleton className="h-4 w-20" />
      <div className="flex items-end gap-2">
        <Skeleton className="h-9 w-12" />
        <Skeleton className="h-4 w-4 rounded-full mb-1" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

function RecentDocRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-border/40 last:border-0">
      <div className="flex-1 space-y-1.5 min-w-0">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full shrink-0" />
    </div>
  );
}

export default function WorkspaceHomeLoading() {
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Documents card */}
        <div className="rounded-xl border bg-card lg:col-span-2">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-14" />
          </div>
          <RecentDocRowSkeleton />
          <RecentDocRowSkeleton />
          <RecentDocRowSkeleton />
          <RecentDocRowSkeleton />
          <RecentDocRowSkeleton />
        </div>

        {/* Quick Actions card */}
        <div className="rounded-xl border bg-card">
          <div className="px-6 py-4 border-b border-border/40">
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="px-6 py-4 flex flex-col gap-3">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
