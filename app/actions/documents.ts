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
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete document.",
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
    const res = await serverFetch(
      `/workspaces/${workspaceSlug}/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    revalidateTag("documents", "max");

    return {
      success: true,
      message: "Document created successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create document.",
    };
  }
}
