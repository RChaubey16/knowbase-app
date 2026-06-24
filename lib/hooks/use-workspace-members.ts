import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { WorkspaceMember } from "@/types/member";

export function useWorkspaceMembers(workspaceSlug: string, orgSlug: string) {
  const fetcher = (url: string) =>
    clientFetch<WorkspaceMember[]>(url, {
      headers: { "X-Organisation": orgSlug },
    });

  const { data, error, isLoading, mutate } = useSWR<WorkspaceMember[]>(
    workspaceSlug ? `/workspaces/${workspaceSlug}/members` : null,
    fetcher,
  );

  const removeMember = async (memberId: string) => {
    await clientFetch(`/workspaces/members/${memberId}`, {
      method: "DELETE",
      headers: { "X-Organisation": orgSlug },
    });
    await mutate(data?.filter((m) => m.id !== memberId));
  };

  return {
    members: data,
    isLoading,
    isError: error,
    removeMember,
  };
}
