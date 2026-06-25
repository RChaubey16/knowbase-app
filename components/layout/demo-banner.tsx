import Link from "next/link";

export function DemoBanner() {
  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between text-sm">
      <span className="text-foreground font-medium">
        You are exploring a demo — all data is read-only.
      </span>
      <Link
        href="/login"
        className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        Sign in to create your own
      </Link>
    </div>
  );
}
