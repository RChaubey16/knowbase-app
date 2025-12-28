"use server";

import { serverFetch } from "@/lib/fetch/server";
import { Document } from "@/types/document";

export async function deleteDocumentAction(
  workspaceSlug: string,
  docId: string | number
) {
  try {
    await serverFetch(`/workspaces/${workspaceSlug}/documents/${docId}`, {
      method: "DELETE",
    });

    return {
      success: true,
      message: "Document deleted successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete document.",
    };
  }
}

type CreateDocumentInput = {
  workspaceSlug: string;
  payload: Record<string, string | number | boolean>; // shape of your form data
};

export async function createDocumentAction({
  workspaceSlug,
  payload,
}: CreateDocumentInput) {
  try {
    const createdDoc = await serverFetch<Document>(
      `/workspaces/${workspaceSlug}/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return {
      success: true,
      message: "Document created successfully.",
      document: createdDoc,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create document.",
    };
  }
}
