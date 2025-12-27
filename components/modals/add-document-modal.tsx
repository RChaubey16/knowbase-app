"use client";

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddDocumentForm from "../forms/add-document-form";
import { WorkspaceFields } from "@/types/workspace";

type ModalContextType = {
  open: (workspace?: WorkspaceFields) => void;
};

const AddDocumentModalContext = createContext<ModalContextType | null>(null);

export function AddDocumentModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceFields | undefined>();

  const handleOpen = (ws?: WorkspaceFields) => {
    setWorkspace(ws);
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    setWorkspace(undefined);
  };

  return (
    <AddDocumentModalContext.Provider value={{ open: handleOpen }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <AddDocumentForm
            workspace={workspace}
            onSuccess={handleClose}
          />
        </DialogContent>
      </Dialog>
    </AddDocumentModalContext.Provider>
  );
}

export function useAddDocumentModal() {
  const ctx = useContext(AddDocumentModalContext);
  if (!ctx) {
    throw new Error(
      "useAddDocumentModal must be used within AddDocumentModalProvider"
    );
  }
  return ctx;
}
