import { TopBar } from "@/components/layout/top-bar";
import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";
import { WorkspaceFields } from "@/types/workspace";
import { notFound } from "next/navigation";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [currOrganisation] = await serverFetch<OrganisationFields[]>(
    `/organisations/${slug}`
  );

  if (!currOrganisation) {
    notFound();
  }

  const workspaces = await serverFetch<WorkspaceFields[]>("/workspaces", {
    headers: {
      "X-Organisation-Id": currOrganisation.id,
    },
  });

  const noWorkspaces = workspaces.length === 0;

  return (
    <>
      <TopBar
        title="Documents"
        indexStatus="ready"
        type="documents"
        noWorkspaces={noWorkspaces}
        workspaces={workspaces}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
