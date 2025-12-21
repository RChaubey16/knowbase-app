import { FileText, Link2, Clock } from "lucide-react";

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
            onClick={() => handleAction("view", doc)}
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {getStatusIcon(doc.status)}
                <span className="truncate">{doc.title}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {doc.snippet}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                {doc.sourceType === "URL" ? (
                  <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-sm">{doc.sourceType}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(doc.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {doc.updated}
              </div>
            </TableCell>
            <TableCell>
              <DocumentActionsDropdown doc={doc} handleAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
</>
  );
};

export default DocumentTable;
