import { FileText, Link2, Clock } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Document, DocumentStatus, ActionType } from "@/types/document";
import DocumentActionsDropdown from "../documents/document-actions-dropdown";
import { timeAgo } from "@/lib/utils";

interface DocumentCardProps {
  doc: Document;
  handleAction: (action: ActionType, doc: Document) => void;
  getStatusIcon: (status: DocumentStatus) => React.ReactNode;
  getStatusBadge: (status: DocumentStatus) => React.ReactNode;
}

const DocumentCard = ({
  doc,
  handleAction,
  getStatusIcon,
  getStatusBadge,
}: DocumentCardProps) => {
  return (
    <Card
      key={doc.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        doc.status === "failed"
          ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
          : doc.status === "processing"
          ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20"
          : ""
      }`}
      onClick={() => handleAction("view", doc)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getStatusIcon(doc.status)}
            <h3 className="font-semibold text-base truncate">{doc.title}</h3>
          </div>

          <DocumentActionsDropdown doc={doc} handleAction={handleAction} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {doc.snippet}
        </p>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              {doc.source === "URL" ? (
                <Link2 className="w-3.5 h-3.5" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>{doc.source}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeAgo(doc.updatedAt)}</span>
            </div>
          </div>
          {getStatusBadge(doc.status)}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
