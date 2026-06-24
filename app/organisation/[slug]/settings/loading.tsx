import { Skeleton } from "@/components/ui/skeleton";

export default function OrgSettingsLoading() {
  return (
    <div className="p-6 max-w-2xl space-y-8 animate-in fade-in duration-500">
      {/* Page title */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* General section */}
      <div className="rounded-lg border p-6 space-y-5">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Danger Zone section */}
      <div className="rounded-lg border border-destructive/40 p-6 space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>
    </div>
  );
}
