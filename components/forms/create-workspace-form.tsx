"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clientFetch } from "@/lib/fetch/client";
import { WorkspaceFields } from "@/types/workspace";

export default function CreateWorkspaceForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ name });
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setError(null);

    try {
      // TODO: Need to add org-id header
      const response: WorkspaceFields = await clientFetch("/workspaces", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name
        }),
      });

      setSubmitSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create workspace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create Workspace</h2>
        <p className="text-muted-foreground">
          Set up a new workspace for your documents
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workspace-name">Workspace Name</Label>
          <Input
            id="workspace-name"
            type="text"
            placeholder="e.g., Engineering Team"
            value={formData.name}
            onChange={handleNameChange}
            required
            className="w-full"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {submitSuccess && (
          <Alert>
            <AlertDescription>Workspace created successfully!</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Workspace"}
        </Button>
      </div>
    </div>
  );
}
