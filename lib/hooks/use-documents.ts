import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { Document } from "@/types/document";
import {
  deleteDocumentAction,
  createDocumentAction,
} from "@/app/actions/documents";

export function useDocuments(
  workspaceSlug: string,
  organisationSlug?: string,
  fallbackData?: Document[]
) {
  const fetcher = (url: string) =>
    clientFetch<Document[]>(url, {
      headers: {
        "X-Organisation": organisationSlug ?? "",
      },
    });

  const { data, error, isLoading, mutate } = useSWR(
    workspaceSlug ? `/workspaces/${workspaceSlug}/documents` : null,
    fetcher,
    { fallbackData }
  );

  const addDocument = async (
    payload: Record<string, string | number | boolean>
  ) => {
    const tempId = Date.now();
    const newDoc: Document = {
      ...(payload as unknown as Document),
      id: tempId,
      status: "ready",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      snippet: (payload.content as string)?.slice(0, 100) ?? "",
      source: (payload.source as string) ?? "Manual",
      type: (payload.type as string) ?? "text",
      title: (payload.title as string) ?? "Untitled",
    };

    return mutate(
      async () => {
        const res = await createDocumentAction({ workspaceSlug, payload });
        if (!res.success) throw new Error(res.message);
        const updatedDocs = [...(data ?? []), res.document].filter(
          (doc): doc is Document => doc !== undefined
        );
        return updatedDocs;
      },
      {
        optimisticData: [...(data ?? []), newDoc],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );
  };

  const deleteDocument = async (docId: string | number) => {
    console.log(`doc id to be deleted`, docId);
    const filteredData = data?.filter((doc) => doc.id !== docId);

    return mutate(
      async () => {
        const res = await deleteDocumentAction(workspaceSlug, docId);
        if (!res.success) throw new Error(res.message);
        return filteredData;
      },
      {
        optimisticData: filteredData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );
  };

  return {
    documents: data,
    isLoading,
    isError: error,
    addDocument,
    deleteDocument,
    refresh: mutate,
  };
}
