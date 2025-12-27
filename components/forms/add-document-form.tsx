"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Document } from "@/types/document";
import { clientFetch } from "@/lib/fetch/client";
import { WorkspaceFields } from "@/types/workspace";

export default function AddDocumentForm({
  workspace,
  onSuccess,
}: {
  workspace?: WorkspaceFields;
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "text",
    source: "Manual",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (!workspace?.slug || !workspace.organisationId) {
      setError("Workspace is not properly configured.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response: Response = await clientFetch(
        `/workspaces/${workspace.slug}/documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Organisation-Id": workspace.organisationId,
          },
          body: JSON.stringify(formData),
        }
      );

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Add Document</h2>
        <p className="text-muted-foreground">
          Enter the details of the new document
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Document title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Document content..."
            value={formData.content}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="text">text</option>
              <option value="URL">URL</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="Manual">Manual</option>
              <option value="webpage">webpage</option>
            </Select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Document"}
        </Button>
      </div>
    </form>
  );
}
