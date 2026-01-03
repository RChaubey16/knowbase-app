import { Skeleton, WorkspaceCardSkeleton } from "@/components/ui/skeleton";

export default function OrganisationLoading() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans">
      <main className="flex-1 flex flex-col items-center py-20 px-4 md:px-8">
        <div className="w-full max-w-5xl space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-96" />
            </div>

            <Skeleton className="h-11 w-48 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkspaceCardSkeleton />
            <WorkspaceCardSkeleton />
            <WorkspaceCardSkeleton />
            <WorkspaceCardSkeleton />
            <WorkspaceCardSkeleton />
            <WorkspaceCardSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}
