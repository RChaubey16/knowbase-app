import { FileText, FileType, Link2, Clock } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Document, DocumentStatus, ActionType } from "@/types/document";
import DocumentActionsDropdown from "../documents/document-actions-dropdown";
import { timeAgo } from "@/lib/utils";

interface DocumentTableProps {
  documents: Document[];
  handleAction: (action: ActionType, doc: Document) => void;
  getStatusIcon: (status: DocumentStatus) => React.ReactNode;
  getStatusBadge: (status: DocumentStatus) => React.ReactNode;
  getRowClassName: (status: DocumentStatus) => string;
}

const DocumentTable = ({
  documents,
  handleAction,
  getStatusIcon,
  getStatusBadge,
  getRowClassName,
}: DocumentTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Title / Source</TableHead>
            <TableHead className="w-[35%]">Snippet</TableHead>
            <TableHead className="w-[10%]">Source Type</TableHead>
            <TableHead className="w-[12%]">Status</TableHead>
            <TableHead className="w-[10%]">Updated</TableHead>
            <TableHead className="w-[3%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow
              key={doc.id}
              className={getRowClassName(doc.status)}
              onClick={() => {
                if (doc.status === "processing") return;
                handleAction("view", doc);
              }}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.status)}
                  <span className="truncate">{doc.title}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-0">
                <p className="text-sm text-muted-foreground truncate overflow-hidden">
                  {doc.snippet}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {doc.type === "url" ? (
                    <Link2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  ) : doc.type === "pdf" ? (
                    <FileType className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  )}
                  {doc.type === "url" && doc.sourceUrl ? (
                    <a
                      href={doc.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm truncate max-w-[180px] hover:underline text-blue-600 dark:text-blue-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {new URL(doc.sourceUrl).hostname}
                    </a>
                  ) : (
                    <span className="text-sm capitalize">{doc.type}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(doc.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {timeAgo(doc.updatedAt)}
                </div>
              </TableCell>
              <TableCell>
                <DocumentActionsDropdown
                  doc={doc}
                  handleAction={handleAction}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default DocumentTable;
