"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "../theme-toggle";

interface TopBarProps {
  title: string;
  indexStatus: "ready" | "updating";
}

export function TopBar({ title, indexStatus }: TopBarProps) {
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <WorkspaceSwitcher />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-full border border-border/50">
          <span className="text-xs font-medium text-muted-foreground">
            Index:
          </span>
          <Badge
            variant={indexStatus === "ready" ? "default" : "secondary"}
            className={`capitalize h-5 px-1.5 text-[10px] font-bold ${
              indexStatus === "ready"
                ? "bg-green-500/15 text-green-600 border-green-500/20 hover:bg-green-500/20"
                : "bg-blue-500/15 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 animate-pulse"
            }`}
          >
            {indexStatus}
          </Badge>
        </div>

        <Button className="button">
          <Plus className="h-4 w-4 stroke-3" />
          Add Document
        </Button>
      </div>
    </div>
  );
}
