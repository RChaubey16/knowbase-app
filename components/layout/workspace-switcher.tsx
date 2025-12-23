"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OrganisationFields } from "@/types/organisation";

const workspaces = [
  {
    id: "1",
    name: "Engineering Team",
    initials: "ET",
  },
  {
    id: "2",
    name: "Marketing Team",
    initials: "MT",
  },
  {
    id: "3",
    name: "Product Design",
    initials: "PD",
  },
];

export function WorkspaceSwitcher({ swticherTitle, spaces }: { swticherTitle: string; spaces: OrganisationFields[] }) {
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(
    spaces[0]
  );

  console.log(`spaces`, spaces)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          role="combobox"
          aria-label="Select a workspace"
          className="w-50 justify-between hover:bg-muted/50 text-foreground font-medium border border-border/40"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
              {selectedWorkspace.name[0]}
            </div>
            <span className="truncate">{selectedWorkspace.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-2 py-1.5">
          {swticherTitle}
        </DropdownMenuLabel>
        {spaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => setSelectedWorkspace(workspace)}
            className="flex items-center gap-2 px-2 py-2"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[10px] font-bold">
              {workspace.name[0]}
            </div>
            <span className="flex-1">{workspace.name}</span>
            {selectedWorkspace.id === workspace.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 px-2 py-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create {swticherTitle}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
