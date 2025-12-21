export type DocumentStatus = "indexed" | "processing" | "failed";

export type ActionType = "view" | "edit" | "reindex" | "delete";

export interface Document {
  id: number;
  title: string;
  snippet: string;
  sourceType: string;
  status: DocumentStatus;
  updated: string;
}
