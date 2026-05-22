"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { clientFetch } from "@/lib/fetch/client";

interface Props {
  workspace: { id: string; name: string; slug: string };
  orgSlug: string;
}

export default function WorkspaceSettingsForm({ workspace, orgSlug }: Props) {
  const router = useRouter();
  const [name, setName] = useState(workspace.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const orgHeader = { "X-Organisation": orgSlug };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === workspace.name) return;
    setIsSaving(true);
    try {
      await clientFetch(`/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: orgHeader,
        body: JSON.stringify({ name: name.trim() }),
      });
      toast.success("Workspace renamed successfully");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to rename");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await clientFetch(`/workspaces/${workspace.id}`, {
        method: "DELETE",
        headers: orgHeader,
      });
      toast.success("Workspace deleted");
      router.push(`/organisation/${orgSlug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      {/* Rename */}
      <section className="rounded-lg border p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold">General</h2>
          <p className="text-sm text-muted-foreground">Update your workspace's display name.</p>
        </div>
        <form onSubmit={handleRename} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workspace name"
              required
            />
          </div>
          <Button type="submit" disabled={isSaving || !name.trim() || name.trim() === workspace.name}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="rounded-lg border border-destructive/40 p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Permanently delete this workspace and all its documents.
          </p>
        </div>
        <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete workspace
        </Button>
      </section>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{workspace.name}</strong> and all its documents.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
