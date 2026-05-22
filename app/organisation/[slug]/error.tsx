"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrgError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred loading this organisation."}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
