import { MoreVertical, FileText, Link2, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const DocumentCard = ({ doc, handleAction, getStatusIcon, getStatusBadge }) => {  
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("view", doc);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("edit", doc);
                }}
              >
                Edit
              </DropdownMenuItem>
              {doc.status === "failed" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("reindex", doc);
                    }}
                  >
                    Re-index
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("delete", doc);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {doc.snippet}
        </p>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              {doc.sourceType === "URL" ? (
                <Link2 className="w-3.5 h-3.5" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>{doc.sourceType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{doc.updated}</span>
            </div>
          </div>
          {getStatusBadge(doc.status)}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
