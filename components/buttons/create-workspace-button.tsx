"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaceModal } from "@/components/modals/create-workspace-modal";

interface CreateWorkspaceButtonProps {
  organisationSlug: string;
}

export default function CreateWorkspaceButton({
  organisationSlug,
}: CreateWorkspaceButtonProps) {
  const { open } = useCreateWorkspaceModal();

  return (
    <Button
      size="lg"
      className="rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
      onClick={() => open(organisationSlug)}
    >
      <Plus className="mr-2 h-5 w-5" />
      Create Workspace
    </Button>
  );
}
