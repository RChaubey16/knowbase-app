"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useDocuments } from "@/lib/hooks/use-documents";
import { toast } from "sonner";
import { Document } from "@/types/document";

interface DocumentFormProps {
  workspace?: {
    slug: string;
    organisationId: string;
  };
  document?: Document;
  onSuccess?: () => void;
}

export default function DocumentForm({
  workspace,
  document,
  onSuccess,
}: DocumentFormProps) {
  const isEdit = !!document;

  const [formData, setFormData] = useState({
    title: document?.title || "",
    content: document?.content || "",
    type: document?.type || "text",
    source: document?.source || "Manual",
    isIndexed: document?.isIndexed ?? true,
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

  const { addDocument, updateDocument } = useDocuments(
    workspace?.slug || "",
    workspace?.organisationId
  );

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

    if (!workspace?.slug) {
      setError("Workspace is not properly configured.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEdit && document) {
        const updatePayload = {
          title: formData.title,
          content: formData.content,
          isIndexed: formData.isIndexed,
        };
        await updateDocument(document.id, updatePayload);
        toast.success("Document updated successfully");
      } else {
        await addDocument(formData);
        toast.success("Document added successfully");
      }
      onSuccess?.();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {isEdit ? "Edit Document" : "Add Document"}
        </h2>
        <p className="text-muted-foreground">
          {isEdit
            ? "Update the details of your document"
            : "Enter the details of the new document"}
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
            rows={isEdit ? 10 : 5}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="isIndexed" className="text-base">
              Index this document for AI Semantic Search
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow this document to be searchable using AI semantic retrieval.
            </p>
          </div>
          <Switch
            id="isIndexed"
            checked={formData.isIndexed}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isIndexed: checked }))
            }
          />
        </div>

        {!isEdit && (
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
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
            ? "Update Document"
            : "Add Document"}
        </Button>
      </div>
    </form>
  );
}
