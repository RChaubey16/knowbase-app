"use client";

import { useState, KeyboardEvent } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { clientFetch } from "@/lib/fetch/client";

interface InviteMembersResponse {
  added: number;
  skipped: string[];
}

export default function InviteMembersForm({
  organisationSlug,
  workspaceSlug,
  onSuccess,
}: {
  organisationSlug: string;
  workspaceSlug?: string;
  onSuccess?: () => void;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [role, setRole] = useState("viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      setEmails(emails.slice(0, -1));
    }
  };

  const addEmail = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && validateEmail(trimmedValue)) {
      if (!emails.includes(trimmedValue)) {
        setEmails([...emails, trimmedValue]);
      }
      setInputValue("");
    } else if (trimmedValue) {
      toast.error("Please enter a valid email address");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add any remaining input as an email if valid
    const trimmedInput = inputValue.trim();
    const finalEmails = [...emails];
    if (trimmedInput) {
      if (validateEmail(trimmedInput)) {
        if (!emails.includes(trimmedInput)) {
          finalEmails.push(trimmedInput);
        }
      } else {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    if (finalEmails.length === 0) {
      toast.error("Please add at least one email address");
      return;
    }

    setIsSubmitting(true);

    let URL = "";
    if (workspaceSlug) {
      URL = `/workspaces/members`;
    } else {
      URL = `/organisations/members`;
    }

    const payload: {
      organisationSlug: string;
      emails: string[];
      role: string;
      workspaceSlug?: string;
    } = {
      organisationSlug,
      emails: finalEmails,
      role,
      ...(workspaceSlug && { workspaceSlug }),
    };

    try {
      const res = await clientFetch<InviteMembersResponse>(URL, {
        method: "POST",
        headers: {
          "X-Organisation": organisationSlug,
        },
        body: JSON.stringify(payload),
      });

      if (res.added <= 0 && res.skipped.length > 0) {
        toast.error(
          `Failed to invite ${res.skipped.join(
            ", "
          )} email(s) as they do not exist`
        );
      } else if (res.added > 0) {
        toast.success(`Sent ${finalEmails.length} invitation(s) as ${role}`);
      }

      onSuccess?.();
    } catch (err: unknown) {
      console.error("Invite error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to send invitations"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Invite Members</h2>
        <p className="text-muted-foreground">
          Invite people to collaborate on this{" "}
          {workspaceSlug ? "Workspace" : "Organisation"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emails">Email addresses</Label>
          <div
            className={cn(
              "flex flex-wrap items-center gap-2 p-2 min-h-11 rounded-md border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              "dark:bg-input/30"
            )}
          >
            {emails.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-sm"
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              id="emails"
              type="text"
              className="flex-1 bg-transparent outline-none min-w-30 text-sm"
              placeholder={
                emails.length === 0
                  ? "Enter emails separated by comma or enter..."
                  : ""
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addEmail}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal h-10 px-3 bg-transparent border-input dark:bg-input/30"
              >
                <span className="capitalize">{role}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                <DropdownMenuRadioItem value="viewer" className="capitalize">
                  Viewer
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="editor" className="capitalize">
                  Editor
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="admin" className="capitalize">
                  Admin
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="owner" className="capitalize">
                  Owner
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs text-muted-foreground mt-1 px-1">
            {role === "viewer" && "Can only view and comment on documents."}
            {role === "editor" && "Can view, edit, and create documents."}
            {role === "admin" && "Can manage workspace settings and members."}
            {role === "owner" &&
              "Full access to all workspace features and settings."}
          </p>
        </div>

        <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
          {isSubmitting ? "Sending Invitations..." : "Send Invitations"}
        </Button>
      </div>
    </form>
  );
}
