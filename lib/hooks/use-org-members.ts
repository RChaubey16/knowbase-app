import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { OrgMember } from "@/types/member";

const fetcher = (url: string) => clientFetch<OrgMember[]>(url);

export function useOrgMembers(orgSlug: string) {
  const { data, error, isLoading, mutate } = useSWR<OrgMember[]>(
    orgSlug ? `/organisations/${orgSlug}/members` : null,
    fetcher,
  );

  const removeMember = async (memberId: string) => {
    await clientFetch(`/organisations/members/${memberId}`, {
      method: "DELETE",
    });
    await mutate(data?.filter((m) => m.id !== memberId));
  };

  const updateMemberRole = async (
    memberId: string,
    role: OrgMember["role"],
  ) => {
    const updated = await clientFetch<OrgMember>(
      `/organisations/members/${memberId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      },
    );
    await mutate(data?.map((m) => (m.id === memberId ? { ...m, role: updated.role } : m)));
  };

  return {
    members: data,
    isLoading,
    isError: error,
    removeMember,
    updateMemberRole,
  };
}
