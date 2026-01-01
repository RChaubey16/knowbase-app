"use client";

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InviteMembersForm from "../forms/invite-members-form";

type ModalContextType = {
  open: (organisationSlug: string, workspaceSlug: string) => void;
};

const InviteMembersModalContext = createContext<ModalContextType | null>(null);

export function InviteMembersModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [slugs, setSlugs] = useState<{ org: string; ws: string } | null>(null);

  const handleOpen = (organisationSlug: string, workspaceSlug: string) => {
    setSlugs({ org: organisationSlug, ws: workspaceSlug });
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    setSlugs(null);
  };

  return (
    <InviteMembersModalContext.Provider value={{ open: handleOpen }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          {slugs && (
            <InviteMembersForm
              organisationSlug={slugs.org}
              workspaceSlug={slugs.ws}
              onSuccess={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </InviteMembersModalContext.Provider>
  );
}

export function useInviteMembersModal() {
  const ctx = useContext(InviteMembersModalContext);
  if (!ctx) {
    throw new Error(
      "useInviteMembersModal must be used within InviteMembersModalProvider"
    );
  }
  return ctx;
}
