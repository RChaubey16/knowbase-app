import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ActionType, Document } from "@/types/document";

interface DocumentActionsDropdownProps {
  doc: Document;
  handleAction: (action: ActionType, doc: Document) => void;
  isDemo?: boolean;
}

const DocumentActionsDropdown = ({ doc, handleAction, isDemo = false }: DocumentActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleAction("view", doc);
          }}
        >
          View
        </DropdownMenuItem>
        {!isDemo && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleAction("edit", doc);
            }}
          >
            Edit
          </DropdownMenuItem>
        )}
        {!isDemo && doc.status === "failed" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleAction("reindex", doc);
              }}
            >
              Re-index
            </DropdownMenuItem>
          </>
        )}
        {!isDemo && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleAction("delete", doc);
              }}
            >
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentActionsDropdown;
