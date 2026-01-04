"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDocuments } from "@/lib/hooks/use-documents";
import { toast } from "sonner";
import { Document } from "@/types/document";

interface EditDocumentFormProps {
  workspace: {
    slug: string;
    organisationId: string;
  };
  document: Document;
  onSuccess?: () => void;
}

export default function EditDocumentForm({
  workspace,
  document,
  onSuccess,
}: EditDocumentFormProps) {
  const [formData, setFormData] = useState({
    title: document.title,
    content: document.content || "",
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

  const { updateDocument } = useDocuments(
    workspace.slug,
    workspace.organisationId
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

    try {
      await updateDocument(document.id, formData);
      toast.success("Document updated successfully");
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
        <h2 className="text-2xl font-bold tracking-tight">Edit Document</h2>
        <p className="text-muted-foreground">
          Update the details of your document
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
            rows={10}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Document"}
        </Button>
      </div>
    </form>
  );
}
