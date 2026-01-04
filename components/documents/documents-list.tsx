"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DocumentCard from "../cards/document-card";
import DocumentTable from "../table/document-table";
import DocumentForm from "../forms/document-form";
import { Document, DocumentStatus, ActionType } from "@/types/document";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { EmptyState } from "../ui/empty-state";
import { useDocuments } from "@/lib/hooks/use-documents";

const DocumentsList = ({
  documents,
  workspaceSlug,
  organisationSlug,
}: {
  documents: Document[];
  workspaceSlug: string;
  organisationSlug?: string;
}) => {
  const { documents: documentsList, deleteDocument } = useDocuments(
    workspaceSlug,
    organisationSlug,
    documents
  );
  const [viewMode, setViewMode] = useState<string>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalPages = Math.ceil((documentsList?.length || 0) / itemsPerPage);
  const currentDocuments = (documentsList || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "ready":
        return (
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
        );
      case "processing":
        return (
          <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
        );
      case "failed":
        return (
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    const variants: Record<
      DocumentStatus,
      "default" | "secondary" | "destructive"
    > = {
      ready: "default",
      processing: "secondary",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const handleAction = async (action: ActionType, doc: Document) => {
    if (action === "view") {
      setSelectedDocument(doc);
      setIsViewModalOpen(true);
    } else if (action === "edit") {
      setSelectedDocument(doc);
      setIsEditModalOpen(true);
    } else if (action === "delete") {
      toast.promise(deleteDocument(doc.id), {
        loading: "Deleting document...",
        success: `Successfully deleted "${doc.title}"`,
        error: (err) => `Failed to delete: ${err.message || "Unknown error"}`,
      });
    }
  };

  const getRowClassName = (status: DocumentStatus) => {
    const base = "cursor-pointer transition-colors";
    if (status === "failed")
      return `${base} bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30`;
    if (status === "processing")
      return `${base} bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30`;
    return `${base} hover:bg-muted/50`;
  };

  if (!documentsList || documentsList.length === 0) {
    return (
      <div className="w-full p-6">
        <EmptyState
          title="No documents yet"
          description="Start building your knowledge base by adding your first document. You can add text, PDFs, or web links."
          actionLabel="Add Document"
          // onAction={() => open && open()}
        />
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-background">
      <div className="mb-6 flex items-center justify-end">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => {
            if (!value) return;
            if (document.startViewTransition) {
              document.startViewTransition(() => {
                setViewMode(value);
              });
            } else {
              setViewMode(value);
            }
          }}
        >
          <ToggleGroupItem value="table" aria-label="Table view">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="cards" aria-label="Cards view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div style={{ viewTransitionName: "documents-view" }} className="w-full">
        {viewMode === "table" ? (
          <div className="border rounded-lg">
            <DocumentTable
              documents={currentDocuments}
              handleAction={handleAction}
              getStatusIcon={getStatusIcon}
              getStatusBadge={getStatusBadge}
              getRowClassName={getRowClassName}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                handleAction={handleAction}
                getStatusIcon={getStatusIcon}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={currentPage === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {totalPages >= 2 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 2}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(2);
                    }}
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
              )}
              {totalPages > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedDocument?.title}
            </DialogTitle>
            <DialogDescription>
              Last updated: {timeAgo(selectedDocument?.updatedAt || "")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 prose dark:prose-invert max-w-none">
            {selectedDocument?.content ? (
              <div className="whitespace-pre-wrap leading-relaxed">
                {selectedDocument.content}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No content available for this document.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl">
          {selectedDocument && (
            <DocumentForm
              workspace={{
                slug: workspaceSlug,
                organisationId: organisationSlug ?? "",
              }}
              document={selectedDocument}
              onSuccess={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsList;
