"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Globe, FileType, CheckCircle2 } from "lucide-react";
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

  const DOCUMENT_OPTIONS = [
    {
      id: "text",
      label: "Document",
      type: "text",
      source: "manual",
      icon: FileText,
    },
    {
      id: "url",
      label: "Webpage",
      type: "url",
      source: "url",
      icon: Globe,
    },
    {
      id: "pdf",
      label: "PDF",
      type: "pdf",
      source: "pdf",
      icon: FileType,
    },
  ];

  const [formData, setFormData] = useState({
    title: document?.title || "",
    content: document?.content || "",
    type: document?.type || "text",
    source: document?.source || "manual",
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
            checked={isEdit? false : formData.isIndexed}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isIndexed: checked }))
            }
          />
        </div>

        {!isEdit && (
          <div className="space-y-3">
            <Label>Document Type</Label>
            <div className="grid grid-cols-3 gap-4">
              {DOCUMENT_OPTIONS.map((option) => {
                const isSelected =
                  formData.type === option.type &&
                  formData.source === option.source;
                const Icon = option.icon;

                return (
                  <Card
                    key={option.id}
                    className={`relative cursor-pointer transition-all hover:border-primary/50 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "bg-card border-border"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: option.type,
                        source: option.source,
                      }))
                    }
                  >
                    <CardContent className="flex flex-col items-center justify-center space-y-2 p-4">
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <Icon
                        className={`h-8 w-8 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
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
