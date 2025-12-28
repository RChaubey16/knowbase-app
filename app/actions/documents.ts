"use server";

import { serverFetch } from "@/lib/fetch/server";
import { revalidateTag } from "next/cache";

export async function deleteDocumentAction(
  workspaceSlug: string,
  docId: string | number
) {
  try {
    await serverFetch(
      `/workspaces/${workspaceSlug}/documents/${docId}`,
      { method: "DELETE" }
    );

    revalidateTag("documents", "max");

    return {
      success: true,
      message: "Document deleted successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "Failed to delete document.",
    };
  }
}
