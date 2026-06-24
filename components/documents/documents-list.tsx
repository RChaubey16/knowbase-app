"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  LayoutGrid,
  LayoutList,
  Loader2,
  Link2,
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
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import DocumentCard from "../cards/document-card";
import DocumentTable from "../table/document-table";
import DocumentForm from "../forms/document-form";
import { Document, DocumentStatus, ActionType } from "@/types/document";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { EmptyState } from "../ui/empty-state";
import { useDocuments } from "@/lib/hooks/use-documents";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

function getStatusIcon(status: DocumentStatus) {
  switch (status) {
    case "ready":
      return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />;
    case "processing":
      return <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />;
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-500" />;
    default:
      return null;
  }
}

const STATUS_BADGE_VARIANTS: Record<DocumentStatus, "default" | "secondary" | "destructive"> = {
  ready: "default",
  processing: "secondary",
  failed: "destructive",
};

function getStatusBadge(status: DocumentStatus) {
  return (
    <Badge variant={STATUS_BADGE_VARIANTS[status]} className="capitalize">
      {status}
    </Badge>
  );
}

function getRowClassName(status: DocumentStatus) {
  const base = "cursor-pointer transition-colors";
  if (status === "failed")
    return `${base} bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30`;
  if (status === "processing")
    return `${base} bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30`;
  return `${base} hover:bg-muted/50`;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

const DocumentsList = ({
  documents,
  workspaceSlug,
  organisationSlug,
}: {
  documents: Document[];
  workspaceSlug: string;
  organisationSlug?: string;
}) => {
  const { documents: documentsList, deleteDocument, reindexDocument, fetchDocument } = useDocuments(
    workspaceSlug,
    organisationSlug,
    documents
  );
  const [viewMode, setViewMode] = useState<string>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewContent, setViewContent] = useState<string | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalPages = Math.ceil((documentsList?.length || 0) / itemsPerPage);
  const currentDocuments = (documentsList || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = async (action: ActionType, doc: Document) => {
    if (action === "view") {
      setSelectedDocument(doc);
      setViewContent(null);
      setIsViewLoading(true);
      setIsViewModalOpen(true);
      fetchDocument(doc.id)
        .then((full) => setViewContent(full.content ?? null))
        .catch(() => setViewContent(null))
        .finally(() => setIsViewLoading(false));
    } else if (action === "edit") {
      setSelectedDocument(doc);
      setIsEditModalOpen(true);
    } else if (action === "reindex") {
      toast.promise(reindexDocument(doc.id), {
        loading: "Re-indexing document...",
        success: `Re-indexing started for "${doc.title}"`,
        error: (err) => `Failed to re-index: ${err.message || "Unknown error"}`,
      });
    } else if (action === "delete") {
      toast.promise(deleteDocument(doc.id), {
        loading: "Deleting document...",
        success: `Successfully deleted "${doc.title}"`,
        error: (err) => `Failed to delete: ${err.message || "Unknown error"}`,
      });
    }
  };

  if (!documentsList || documentsList.length === 0) {
    return (
      <div className="w-full p-6">
        <EmptyState
          title="No documents yet"
          description="Start building your knowledge base by adding your first document. You can add text, PDFs, or web links."
          actionLabel="Add Document"
          onAction={() => setIsAddModalOpen(true)}
        />
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-xl">
            <DocumentForm
              workspace={{ slug: workspaceSlug, organisationId: organisationSlug ?? "" }}
              onSuccess={() => setIsAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
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
          <ToggleGroupItem value="table" aria-label="Table view" className="cursor-pointer">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="cards" aria-label="Cards view" className="cursor-pointer">
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
              {getPageNumbers(currentPage, totalPages).map((page, i) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-2xl font-bold">
              {selectedDocument?.title}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-1 mt-1">
                <span>Last updated: {timeAgo(selectedDocument?.updatedAt || "")}</span>
                {selectedDocument?.type === "url" && selectedDocument.sourceUrl && (
                  <a
                    href={selectedDocument.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline w-fit"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {selectedDocument.sourceUrl}
                  </a>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto prose dark:prose-invert max-w-none pr-1">
            {isViewLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : viewContent ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {viewContent}
              </ReactMarkdown>
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
