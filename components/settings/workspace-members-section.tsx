"use client";

import { useState } from "react";
import useSWR from "swr";
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InviteMembersForm from "@/components/forms/invite-members-form";
import { clientFetch } from "@/lib/fetch/client";
import { WorkspaceMember } from "@/types/member";

const ROLE_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  owner: "default",
  admin: "secondary",
  editor: "secondary",
  viewer: "secondary",
};

interface Props {
  orgSlug: string;
  workspaceSlug: string;
}

export default function WorkspaceMembersSection({ orgSlug, workspaceSlug }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<WorkspaceMember | null>(null);

  const { data: members, mutate } = useSWR<WorkspaceMember[]>(
    `/workspaces/${workspaceSlug}/members`,
    (url: string) =>
      clientFetch<WorkspaceMember[]>(url, {
        headers: { "X-Organisation": orgSlug },
      }),
  );

  const handleRemove = async (member: WorkspaceMember) => {
    setRemovingId(member.id);
    try {
      await clientFetch(`/workspaces/${workspaceSlug}/members/${member.id}`, {
        method: "DELETE",
        headers: { "X-Organisation": orgSlug },
      });
      toast.success(`${member.email} removed from workspace`);
      setConfirmRemove(null);
      await mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Members</h2>
          <p className="text-sm text-muted-foreground">
            People with access to this workspace.
          </p>
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Members
        </Button>
      </div>

      <div className="divide-y rounded-md border">
        {!members ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">Loading…</p>
        ) : members.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">No members yet.</p>
        ) : (
          members.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-sm truncate flex-1">{m.email}</span>
              <Badge variant={ROLE_VARIANT[m.role] ?? "secondary"} className="capitalize shrink-0">
                {m.role}
              </Badge>
              {m.role !== "owner" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => setConfirmRemove(m)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <InviteMembersForm
            organisationSlug={orgSlug}
            workspaceSlug={workspaceSlug}
            onSuccess={() => {
              setInviteOpen(false);
              mutate();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm remove dialog */}
      <Dialog open={!!confirmRemove} onOpenChange={(open) => !open && setConfirmRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member?</DialogTitle>
            <DialogDescription>
              Remove <strong>{confirmRemove?.email}</strong> from this workspace?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRemove(null)} disabled={!!removingId}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmRemove && handleRemove(confirmRemove)}
              disabled={!!removingId}
            >
              {removingId ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
