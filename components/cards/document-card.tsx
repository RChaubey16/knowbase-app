import { FileText, FileType, Link2, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Document, DocumentStatus, ActionType } from "@/types/document";
import DocumentActionsDropdown from "../documents/document-actions-dropdown";
import { timeAgo, cn } from "@/lib/utils";

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
      className={cn(
        "group relative flex flex-col h-full bg-card hover:bg-muted/30 transition-all duration-300 border-border/50 hover:border-primary/30 hover:shadow-md cursor-pointer overflow-hidden",
        doc.status === "failed" &&
          "border-red-200/50 bg-red-50/10 dark:border-red-900/50 dark:bg-red-950/5",
        doc.status === "processing" &&
          "border-blue-200/50 bg-blue-50/10 dark:border-blue-900/50 dark:bg-blue-950/5"
      )}
      onClick={() => {
        if (doc.status === "processing") return;
        handleAction("view", doc);
      }}
    >
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 rounded-lg bg-background border border-border/40 group-hover:border-primary/30 transition-colors">
              {getStatusIcon(doc.status)}
            </div>
            <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
              {doc.title}
            </h3>
          </div>
          <DocumentActionsDropdown doc={doc} handleAction={handleAction} />
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1 relative">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed group-hover:text-foreground/80 transition-colors">
          {doc.snippet}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground relative bg-muted/5 group-hover:bg-transparent transition-colors mt-auto">
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1.5 font-medium">
            {doc.type === "url" ? (
              <Link2 className="w-3.5 h-3.5 shrink-0" />
            ) : doc.type === "pdf" ? (
              <FileType className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <FileText className="w-3.5 h-3.5 shrink-0" />
            )}
            {doc.type === "url" && doc.sourceUrl ? (
              <a
                href={doc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate max-w-[140px] hover:underline text-blue-600 dark:text-blue-400"
                onClick={(e) => e.stopPropagation()}
              >
                {new URL(doc.sourceUrl).hostname}
              </a>
            ) : (
              <span className="capitalize">{doc.type}</span>
            )}
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo(doc.updatedAt)}</span>
          </div>
        </div>
        {getStatusBadge(doc.status)}
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
