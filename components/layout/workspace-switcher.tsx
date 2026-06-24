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
import { WorkspaceFields } from "@/types/workspace";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "../modals/create-workspace-modal";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useOrganisations } from "@/lib/hooks/use-organisations";
import { useWorkspaces } from "@/lib/hooks/use-workspaces";

export function WorkspaceSwitcher({
  swticherTitle,
  buttonText,
  spaces,
  selectedSpace,
  orgSlug,
  userRole,
}: {
  swticherTitle: string;
  buttonText: string;
  spaces: OrganisationFields[] | WorkspaceFields[];
  selectedSpace?: OrganisationFields | WorkspaceFields;
  orgSlug?: string;
  userRole?: string;
}) {
  const router = useRouter();
  const { open } = useCreateWorkspaceModal();

  const { organisations } = useOrganisations(
    buttonText === "organisation" ? (spaces as OrganisationFields[]) : undefined
  );
  const { workspaces } = useWorkspaces(
    buttonText === "workspace"
      ? (selectedSpace as WorkspaceFields)?.organisationId
      : undefined,
    buttonText === "workspace" ? (spaces as WorkspaceFields[]) : undefined
  );

  const { updateOrganisation, deleteOrganisation } = useOrganisations();
  const { updateWorkspace, deleteWorkspace } = useWorkspaces(orgSlug);

  const currentSpaces =
    (buttonText === "organisation" ? organisations : workspaces) || spaces;

  const [selectedWorkspace, setSelectedWorkspace] = React.useState(
    selectedSpace ?? currentSpaces[0]
  );

  const [editingItem, setEditingItem] = React.useState<
    OrganisationFields | WorkspaceFields | null
  >(null);
  const [deletingItem, setDeletingItem] = React.useState<
    OrganisationFields | WorkspaceFields | null
  >(null);
  const [newName, setNewName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync state if selectedSpace changes (e.g. navigation)
  React.useEffect(() => {
    if (selectedSpace) {
      setSelectedWorkspace(selectedSpace);
    }
  }, [selectedSpace]);

  const onEdit = (item: OrganisationFields | WorkspaceFields) => {
    setEditingItem(item);
    setNewName(item.name);
  };

  const handleUpdate = async () => {
    if (!editingItem || !newName.trim()) return;
    setIsSubmitting(true);
    try {
      if (buttonText === "organisation") {
        await updateOrganisation(
          (editingItem as OrganisationFields).id,
          newName
        );
      } else {
        await updateWorkspace((editingItem as WorkspaceFields).id, newName);
      }
      toast.success(
        `${
          buttonText === "organisation" ? "Organisation" : "Workspace"
        } updated`
      );
      setEditingItem(null);
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    try {
      if (buttonText === "organisation") {
        await deleteOrganisation((deletingItem as OrganisationFields).id);
      } else {
        await deleteWorkspace((deletingItem as WorkspaceFields).id);
      }
      toast.success(
        `${
          buttonText === "organisation" ? "Organisation" : "Workspace"
        } deleted`
      );

      if (buttonText === "organisation" && deletingItem.slug == selectedSpace?.slug) {
        router.push("/");
      }

      if (buttonText === "workspace" && deletingItem.slug == selectedSpace?.slug) {
        router.push(`/organisation/${orgSlug}`);
      }

      setDeletingItem(null);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          role="combobox"
          aria-label="Select a workspace"
          className="w-fit justify-between hover:bg-muted/50 text-foreground font-medium border border-border/40 cursor-pointer"
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
        {currentSpaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => {
              setSelectedWorkspace(workspace);
              if (buttonText === "workspace") {
                router.push(
                  `/organisation/${orgSlug}/workspaces/${workspace.slug}`
                );
              } else {
                router.push(`/organisation/${workspace.slug}`);
              }
            }}
            className="flex items-center gap-2 px-2 py-2 group cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[10px] font-bold">
              {workspace.name[0]}
            </div>
            <span className="flex-1 truncate">{workspace.name}</span>

            {userRole === "owner" && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-muted"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(workspace);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeletingItem(workspace);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            )}

            {selectedWorkspace.id === workspace.id && (
              <Check className="h-4 w-4 shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
        {userRole === "owner" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-2 cursor-pointer"
              onClick={() => {
                if (buttonText === "workspace") {
                  open(orgSlug);
                } else {
                  router.push(`/organisation/create`);
                }
              }}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create {buttonText}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {buttonText}</DialogTitle>
            <DialogDescription>
              Update the name of your {buttonText}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {buttonText}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {buttonText}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingItem(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
