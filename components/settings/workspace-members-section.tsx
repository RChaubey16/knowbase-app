"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspaceMembers } from "@/lib/hooks/use-workspace-members";
import {
  InviteMembersModalProvider,
  useInviteMembersModal,
} from "@/components/modals/invite-members-modal";
import { WorkspaceMember } from "@/types/member";

const ROLE_COLORS: Record<WorkspaceMember["role"], string> = {
  owner: "bg-violet-500/15 text-violet-600 border-violet-500/20",
  admin: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  editor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  viewer: "bg-zinc-500/15 text-zinc-600 border-zinc-500/20",
};

function MemberAvatar({ member }: { member: WorkspaceMember }) {
  const initials = member.firstName
    ? `${member.firstName[0]}${member.lastName?.[0] ?? ""}`.toUpperCase()
    : member.email[0].toUpperCase();

  if (member.avatar) {
    return (
      <img
        src={member.avatar}
        alt={initials}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  );
}

function displayName(member: WorkspaceMember) {
  if (member.firstName) {
    return `${member.firstName}${member.lastName ? " " + member.lastName : ""}`;
  }
  return member.email.split("@")[0];
}

interface Props {
  workspaceSlug: string;
  orgSlug: string;
}

export default function WorkspaceMembersSection(props: Props) {
  return (
    <InviteMembersModalProvider>
      <WorkspaceMembersSectionContent {...props} />
    </InviteMembersModalProvider>
  );
}

function WorkspaceMembersSectionContent({ workspaceSlug, orgSlug }: Props) {
  const { members, isLoading, removeMember } = useWorkspaceMembers(workspaceSlug, orgSlug);
  const { open: openInvite } = useInviteMembersModal();
  const [targetMember, setTargetMember] = useState<WorkspaceMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!targetMember) return;
    setIsRemoving(true);
    try {
      await removeMember(targetMember.id);
      toast.success(`${displayName(targetMember)} removed from workspace`);
      setTargetMember(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <section className="rounded-lg border p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold">Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage who has access to this workspace.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => openInvite(orgSlug, workspaceSlug)}
        >
          Invite members
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 rounded bg-muted" />
                <div className="h-3 w-48 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border rounded-md border">
          {members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <MemberAvatar member={member} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayName(member)}</p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>
              <Badge
                className={`capitalize ${ROLE_COLORS[member.role]}`}
                variant="outline"
              >
                {member.role}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setTargetMember(member)}
                aria-label={`Remove ${displayName(member)}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {members?.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              No members yet.
            </p>
          )}
        </div>
      )}

      <Dialog open={!!targetMember} onOpenChange={(open) => !open && setTargetMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member?</DialogTitle>
            <DialogDescription>
              Remove <strong>{targetMember ? displayName(targetMember) : ""}</strong> from
              this workspace? They will lose access to all documents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTargetMember(null)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove} disabled={isRemoving}>
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
