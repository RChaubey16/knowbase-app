import { TableRowSkeleton } from "@/components/ui/skeleton";

export default function DocumentsLoading() {
  return (
    <div className="w-full p-6 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-end">
        <div className="h-10 w-24 bg-muted/30 rounded-md animate-pulse" />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/20 h-10 border-b border-border/40" />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}
