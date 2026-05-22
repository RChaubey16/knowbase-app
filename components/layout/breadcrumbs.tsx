"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  // Don't show breadcrumbs on the home page
  if (paths.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 text-sm text-muted-foreground mb-6"
    >
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const cleanPath = path.replace(/-[a-zA-Z0-9]{8}$/, "");
        const label =
          cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1).replace(/-/g, " ");

        // Skip intermediate routing segments if they are just identifiers like "organisation" or "workspaces"
        // But keep the actual slug values. This is a bit opinionated based on the URL structure.
        if (path === "organisation" || path === "workspaces") {
          return null;
        }

        return (
          <div key={path} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4 shrink-0" />
            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
