export type DocumentStatus = "ready" | "processing" | "failed";

export type ActionType = "view" | "edit" | "reindex" | "delete";

export interface Document {
  id: number;
  title: string;
  snippet: string;
  content?: string;
  source: string;
  sourceUrl?: string | null;
  type: string;
  status: DocumentStatus;
  isIndexed: boolean;
  updatedAt: string;
  createdAt: string;
}
