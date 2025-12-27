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
import { Document, DocumentStatus, ActionType } from "@/types/document";
import { timeAgo } from "@/lib/utils";
import { clientFetch } from "@/lib/fetch/client";

const DocumentsList = ({
  documents,
  workspaceSlug,
}: {
  documents: Document[];
  workspaceSlug: string;
}) => {
  const [viewMode, setViewMode] = useState<string>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentsList] = useState<Document[]>(
    documents || [
      {
        id: 1,
        title: "Product Requirements Document",
        snippet:
          "This document outlines the core features and specifications for the Q4 release...",
        source: "Manual",
        status: "indexed",
        updatedAt: "2h ago",
      },
      {
        id: 2,
        title: "API Documentation",
        snippet:
          "Complete REST API reference with authentication, endpoints, and response formats...",
        content: `## API Documentation

This API enables users to interact with our platform programmatically. 

### Base URL
\`https://api.example.com/v1\`

### Authentication
All requests must include an \`Authorization: Bearer <token>\` header.

### Endpoints

- **GET /users**: Retrieve a list of users.
- **POST /projects**: Create a new project.
- **DELETE /documents/{id}**: Remove a document.

### Error Handling
Errors are returned as JSON with the following structure:
\`\`\`json
{
  "error": "Not Found",
  "message": "The requested resource does not exist.",
  "status": 404
}
\`\`\`
`,
        source: "URL",
        status: "indexed",
        updatedAt: "5h ago",
      },
      {
        id: 3,
        title: "Marketing Strategy 2024",
        snippet:
          "Comprehensive marketing plan covering digital channels, budget allocation...",
        source: "Manual",
        status: "processing",
        updatedAt: "1d ago",
      },
      {
        id: 4,
        title: "Technical Architecture Overview",
        snippet:
          "System design and infrastructure details for the microservices platform...",
        source: "URL",
        status: "failed",
        updatedAt: "3d ago",
      },
      {
        id: 5,
        title: "User Research Findings",
        snippet:
          "Analysis of user interviews and survey data from 150+ participants...",
        content: `# User Research Findings - Q4 2023

## Executive Summary
Our research shows that users are primarily looking for faster navigation and improved collaboration tools.

## Key Insights
1. **Navigation**: 65% of users find it difficult to locate advanced settings.
2. **Collaboration**: User interest in real-time document editing has increased by 40%.
3. **Themes**: Dark mode remains the most requested UI feature.

## Recommendations
- Redesign the global navigation menu.
- Prioritize real-time WebSocket implementation for editors.
- Introduce customizable dashboard themes.
`,
        source: "Manual",
        status: "indexed",
        updatedAt: "1w ago",
      },
    ]
  );

  const totalPages = Math.ceil(documentsList.length / itemsPerPage);
  const currentDocuments = documentsList.slice(
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
    console.log(`${action} document:`, doc);
    if (action === "view") {
      setSelectedDocument(doc);
      setIsModalOpen(true);
    } else if (action === "delete") {
      try {
        const response: Response = await clientFetch(
          `/workspaces/${workspaceSlug}/documents/${doc.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-Organisation-Id": "12266b48-413d-4a31-86b3-4e9f70bda195",
            },
          }
        );
        
        console.log(`RESP`, response)

        if (!response.ok) {
          console.error("Failed to delete document. Please try again.");
          return;
        }
      } catch (err) {
        console.error(err);
      }
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
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentPage === 2}
                onClick={(e) => {
                  e.preventDefault();
                  if (totalPages >= 2) setCurrentPage(2);
                }}
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => p + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
    </div>
  );
};

export default DocumentsList;
