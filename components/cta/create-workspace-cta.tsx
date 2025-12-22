"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateWorkspaceForm from '@/components/forms/create-workspace-form';

export default function CreateWorkspaceCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">
            Welcome! Let&apos;s get started
          </h2>
          <p className="text-muted-foreground">
            You don&apos;t have any workspaces yet. Create your first workspace to start collaborating with your team and organizing your projects.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <CreateWorkspaceForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
