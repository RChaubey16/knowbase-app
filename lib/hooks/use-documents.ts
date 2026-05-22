import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { Document, DocumentStatus } from "@/types/document";
import {
  deleteDocumentAction,
  createDocumentAction,
  updateDocumentAction,
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
    {
      fallbackData,
      refreshInterval: (latestData) =>
        latestData?.some((d) => d.status === "processing") ? 4000 : 0,
    }
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
      isIndexed: (payload.isIndexed as boolean) ?? true,
    };

    return mutate(
      async () => {
        const res = await createDocumentAction({ workspaceSlug, payload });
        if (!res.success) throw new Error(res.message);
        if (!res.document) throw new Error("Document not found");
        res.document.status = "processing";
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

  const updateDocument = async (
    docId: string | number,
    payload: Record<string, string | number | boolean>
  ) => {
    const currentDoc = data?.find((doc) => doc.id === docId);
    if (!currentDoc) return;

    const updatedDoc: Document = {
      ...currentDoc,
      ...(payload as unknown as Partial<Document>),
      updatedAt: new Date().toISOString(),
    };

    const optimisticData = data?.map((doc) =>
      doc.id === docId ? updatedDoc : doc
    );

    return mutate(
      async () => {
        const res = await updateDocumentAction(workspaceSlug, docId, payload);
        if (!res.success) throw new Error(res.message);
        if (!res.document) throw new Error("Document not found");
        return data?.map((doc) => (doc.id === docId ? res.document : doc));
      },
      {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );
  };

  const reindexDocument = async (docId: string | number) => {
    const optimisticData = data?.map((doc) =>
      doc.id === docId
        ? { ...doc, status: "processing" as DocumentStatus }
        : doc
    );

    return mutate(
      async () => {
        await clientFetch(`/workspaces/${workspaceSlug}/documents/${docId}/reindex`, {
          method: "POST",
          headers: { "X-Organisation": organisationSlug ?? "" },
        });
        return optimisticData;
      },
      {
        optimisticData,
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
    updateDocument,
    deleteDocument,
    reindexDocument,
    refresh: mutate,
  };
}
