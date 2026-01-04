import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { WorkspaceFields } from "@/types/workspace";

export function useWorkspaces(organisationSlug?: string, fallbackData?: WorkspaceFields[]) {
  const { data, error, isLoading, mutate } = useSWR<WorkspaceFields[]>(
    organisationSlug ? `/workspaces` : null,
    (url) => clientFetch<WorkspaceFields[]>(url, {
      headers: {
        "X-Organisation": organisationSlug || "",
      },
    }),
    {
      fallbackData,
    }
  );

  const createWorkspace = async (name: string) => {
    if (!organisationSlug) throw new Error("Organisation slug is required");

    const newWorkspace = { name, id: Date.now().toString(), slug: name.toLowerCase().replace(/ /g, '-') };

    let created: WorkspaceFields | undefined;

    await mutate(
      async () => {
        created = await clientFetch<WorkspaceFields>("/workspaces", {
          method: "POST",
          headers: {
            "X-Organisation": organisationSlug,
          },
          body: JSON.stringify({ name }),
        });
        return [...(data || []), created];
      },
      {
        optimisticData: [...(data || []), newWorkspace as unknown as WorkspaceFields],
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );

    return created;
  };

  const updateWorkspace = async (id: number, name: string) => {
    if (!organisationSlug) throw new Error("Organisation slug is required");

    let updated: WorkspaceFields | undefined;

    await mutate(
      async () => {
        updated = await clientFetch<WorkspaceFields>(`/workspaces/${id}`, {
          method: "PUT",
          headers: {
            "X-Organisation": organisationSlug,
          },
          body: JSON.stringify({ name }),
        });
        return (data || []).map((ws) => (ws.id === id ? updated! : ws));
      },
      {
        optimisticData: (data || []).map((ws) =>
          ws.id === id ? { ...ws, name } as unknown as WorkspaceFields : ws
        ),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );

    return updated;
  };

  const deleteWorkspace = async (id: number) => {
    if (!organisationSlug) throw new Error("Organisation slug is required");

    await mutate(
      async () => {
        await clientFetch(`/workspaces/${id}`, {
          method: "DELETE",
          headers: {
            "X-Organisation": organisationSlug,
          },
        });
        return (data || []).filter((ws) => ws.id !== id);
      },
      {
        optimisticData: (data || []).filter((ws) => ws.id !== id),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );
  };

  return {
    workspaces: data,
    isLoading,
    isError: error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    refresh: mutate,
  };
}
