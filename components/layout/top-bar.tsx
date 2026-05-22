"use client";

import { Plus, Settings, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "../theme-toggle";
import {
  AddDocumentModalProvider,
  useAddDocumentModal,
} from "../modals/add-document-modal";
import {
  InviteMembersModalProvider,
  useInviteMembersModal,
} from "../modals/invite-members-modal";
import { WorkspaceFields } from "@/types/workspace";

interface TopBarProps {
  indexStatus: "ready" | "updating";
  noWorkspaces?: boolean;
  workspaces: WorkspaceFields[];
  orgSlug: string;
  workspaceSlug?: string;
  wsUserRole: string;
}

export function TopBar(props: TopBarProps) {
  return (
    <AddDocumentModalProvider>
      <InviteMembersModalProvider>
        <TopBarContent {...props} />
      </InviteMembersModalProvider>
    </AddDocumentModalProvider>
  );
}

function TopBarContent({
  indexStatus,
  noWorkspaces,
  workspaces,
  orgSlug,
  workspaceSlug,
  wsUserRole,
}: TopBarProps) {
  const { open: openAddDoc } = useAddDocumentModal();
  const { open: openInvite } = useInviteMembersModal();
  const pathname = usePathname();
  const isSearchPage = pathname.endsWith("/search");
  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.slug === workspaceSlug
  );

  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {!noWorkspaces && (
          <>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Workspace:
            </h1>
            <WorkspaceSwitcher
              swticherTitle="Workspaces"
              buttonText="workspace"
              spaces={workspaces}
              orgSlug={orgSlug}
              selectedSpace={selectedWorkspace}
              userRole={wsUserRole}
            />
          </>
        )}
        <Separator orientation="vertical" className="h-6" />
      </div>

      <div className="flex items-center gap-3">
        {!isSearchPage && (
          <>
            {/* <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-full border border-border/50">
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
            </div> */}

            {wsUserRole === "owner" && (
              <Button
                variant="outline"
                className="button bg-transparent border-primary/20 hover:bg-primary/5 text-foreground"
                disabled={!workspaceSlug}
                onClick={() => openInvite(orgSlug, workspaceSlug!)}
              >
                <UserPlus className="h-4 w-4 stroke-2" />
                Invite members to Workspace
              </Button>
            )}
            
            {wsUserRole !== "viewer" && 

            <Button
              className="button"
              onClick={() => openAddDoc(selectedWorkspace)}
            >
              <Plus className="h-4 w-4 stroke-3" />
              Add Document
            </Button>}
          </>
        )}
        {wsUserRole === "owner" && workspaceSlug && (
          <Link href={`/organisation/${orgSlug}/workspaces/${workspaceSlug}/settings`}>
            <Button variant="ghost" size="icon" aria-label="Workspace settings">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
