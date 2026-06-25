"use client";

import Link from "next/link";
import { FileText, Search, CheckCircle, RefreshCw, AlertCircle, Plus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddDocumentModalProvider, useAddDocumentModal } from "@/components/modals/add-document-modal";
import { Document, DocumentStatus } from "@/types/document";
import { WorkspaceFields } from "@/types/workspace";
import { timeAgo } from "@/lib/utils";

interface WorkspaceDashboardProps {
  documents: Document[];
  workspace: WorkspaceFields;
  organisationSlug: string;
  workspaceSlug: string;
  isDemo?: boolean;
}

const STATUS_BADGE_VARIANT: Record<DocumentStatus, "default" | "secondary" | "destructive"> = {
  ready: "default",
  processing: "secondary",
  failed: "destructive",
};

function DashboardContent({ documents, workspace, organisationSlug, workspaceSlug, isDemo = false }: WorkspaceDashboardProps) {
  const { open: openAddDoc } = useAddDocumentModal();

  const total = documents.length;
  const ready = documents.filter((d) => d.status === "ready").length;
  const processing = documents.filter((d) => d.status === "processing").length;
  const failed = documents.filter((d) => d.status === "failed").length;
  const recentDocs = documents.slice(0, 5);

  const searchHref = `/organisation/${organisationSlug}/workspaces/${workspaceSlug}/search`;
  const documentsHref = `/organisation/${organisationSlug}/workspaces/${workspaceSlug}/documents`;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{total}</span>
              <FileText className="mb-1 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-green-600 dark:text-green-500">{ready}</span>
              <CheckCircle className="mb-1 h-4 w-4 text-green-600 dark:text-green-500" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">indexed &amp; searchable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{processing}</span>
              <RefreshCw className="mb-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">being indexed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-red-600 dark:text-red-500">{failed}</span>
              <AlertCircle className="mb-1 h-4 w-4 text-red-600 dark:text-red-500" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Documents */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Documents</CardTitle>
            <Link
              href={documentsHref}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentDocs.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground">No documents yet.</p>
            ) : (
              <ul className="divide-y">
                {recentDocs.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-4 px-6 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{doc.title}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {timeAgo(doc.updatedAt)}
                      </p>
                    </div>
                    <Badge variant={STATUS_BADGE_VARIANT[doc.status]} className="shrink-0 capitalize">
                      {doc.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {!isDemo && (
              <Button
                className="w-full justify-start gap-2"
                onClick={() => openAddDoc(workspace)}
              >
                <Plus className="h-4 w-4" />
                Add Document
              </Button>
            )}
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link href={searchHref}>
                <Search className="h-4 w-4" />
                Search Docs
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link href={documentsHref}>
                <FileText className="h-4 w-4" />
                All Documents
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function WorkspaceDashboard(props: WorkspaceDashboardProps) {
  return (
    <AddDocumentModalProvider>
      <DashboardContent {...props} />
    </AddDocumentModalProvider>
  );
}
