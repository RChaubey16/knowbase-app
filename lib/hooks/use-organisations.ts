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

  return {
    organisations: data,
    isLoading,
    isError: error,
    createOrganisation,
    refresh: mutate,
  };
}
