import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { Document } from "@/types/document";
import { deleteDocumentAction, createDocumentAction } from "@/app/actions/documents";

export function useDocuments(workspaceSlug: string, organisationId?: string, fallbackData?: Document[]) {
  const { data, error, isLoading, mutate } = useSWR<Document[]>(
    workspaceSlug ? `/workspaces/${workspaceSlug}/documents` : null,
    (url) => clientFetch<Document[]>(url),
    {
      fallbackData,
    }
  );

  const addDocument = async (payload: Record<string, string | number | boolean>) => {
    const tempId = Date.now();
    const newDoc = { ...payload, id: tempId, status: "ready", updatedAt: new Date().toISOString() };
    
    return mutate(
      async () => {
        const res = await createDocumentAction({ workspaceSlug, payload });
        if (!res.success) throw new Error(res.message);
        // We revalidate to get the real data from server after action
        return data; 
      },
      {
        optimisticData: [...(data || []), newDoc as unknown as Document],
        rollbackOnError: true,
        populateCache: false, // Revalidate instead
        revalidate: true,
      }
    );
  };

  const deleteDocument = async (docId: string | number) => {
    const filteredData = data?.filter(doc => doc.id !== docId);

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
