export type DocumentStatus = "ready" | "processing" | "failed";

export type ActionType = "view" | "edit" | "reindex" | "delete";

export interface Document {
  id: number;
  title: string;
  snippet: string;
  content?: string;
  source: string;
  type: string;
  status: DocumentStatus;
  updatedAt: string;
  createdAt: string;
}
