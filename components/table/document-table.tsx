import { MoreVertical, FileText, Link2, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const DocumentTable = ({ documents, handleAction, getStatusIcon, getStatusBadge, getRowClassName }) => {
  return (
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
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DocumentTable;
