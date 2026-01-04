import useSWR from "swr";
import { clientFetch } from "@/lib/fetch/client";
import { OrganisationFields } from "@/types/organisation";

const fetcher = (url: string) => clientFetch<OrganisationFields[]>(url);

export function useOrganisations(fallbackData?: OrganisationFields[]) {
  const { data, error, isLoading, mutate } = useSWR<OrganisationFields[]>(
    "/organisations",
    fetcher,
    {
      fallbackData,
    }
  );

  const createOrganisation = async (name: string, slug: string) => {
    const newOrg = { name, slug, id: Date.now().toString() }; // Temporary ID for optimistic update

    let created: OrganisationFields | undefined;

    await mutate(
      async () => {
        created = await clientFetch<OrganisationFields>("/organisations", {
          method: "POST",
          body: JSON.stringify({ name, slug }),
        });
        return [...(data || []), created];
      },
      {
        optimisticData: [...(data || []), newOrg as OrganisationFields],
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );

    return created;
  };

  const updateOrganisation = async (id: string, name: string) => {
    let updated: OrganisationFields | undefined;

    await mutate(
      async () => {
        updated = await clientFetch<OrganisationFields>(`/organisations/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name }),
        });
        return (data || []).map((org) => (org.id === id ? updated! : org));
      },
      {
        optimisticData: (data || []).map((org) =>
          org.id === id ? { ...org, name } : org
        ),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );

    return updated;
  };

  const deleteOrganisation = async (id: string) => {
    await mutate(
      async () => {
        await clientFetch(`/organisations/${id}`, {
          method: "DELETE",
        });
        return (data || []).filter((org) => org.id !== id);
      },
      {
        optimisticData: (data || []).filter((org) => org.id !== id),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      }
    );
  };

  return {
    organisations: data,
    isLoading,
    isError: error,
    createOrganisation,
    updateOrganisation,
    deleteOrganisation,
    refresh: mutate,
  };
}
