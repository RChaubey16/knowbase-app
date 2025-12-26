"use client";

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateWorkspaceForm from "../forms/create-workspace-form";

type ModalContextType = {
  open: (organisationId?: string, organisationSlug?: string) => void;
};

const CreateWorkspaceModalContext = createContext<ModalContextType | null>(
  null
);

export function CreateWorkspaceModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [organisation, setOrganisation] = useState<
    { id?: string; slug?: string } | undefined
  >();

  const handleOpen = (id?: string, slug?: string) => {
    setOrganisation({
      id,
      slug,
    });
    setOpen(true);
  };

  return (
    <CreateWorkspaceModalContext.Provider value={{ open: handleOpen }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <CreateWorkspaceForm
            organisationId={organisation?.id}
            organisationSlug={organisation?.slug}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </CreateWorkspaceModalContext.Provider>
  );
}

export function useCreateWorkspaceModal() {
  const ctx = useContext(CreateWorkspaceModalContext);
  if (!ctx) {
    throw new Error(
      "useCreateWorkspaceModal must be used within CreateWorkspaceModalProvider"
    );
  }
  return ctx;
}
