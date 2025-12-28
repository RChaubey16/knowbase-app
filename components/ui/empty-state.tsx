import { FileIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/10">
      <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
        <FileIcon className="h-10 w-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="button gap-2">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
