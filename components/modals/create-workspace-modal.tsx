"use client";

import { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import CreateWorkspaceForm from "../forms/create-workspace-form";

type ModalContextType = {
  open: () => void;
};

const CreateWorkspaceModalContext =
  createContext<ModalContextType | null>(null);

export function CreateWorkspaceModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <CreateWorkspaceModalContext.Provider
      value={{ open: () => setOpen(true) }}
    >
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <CreateWorkspaceForm onSuccess={() => setOpen(false)} />
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
