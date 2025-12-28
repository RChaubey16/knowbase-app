import { TopBar } from "@/components/layout/top-bar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";
import { WorkspaceFields } from "@/types/workspace";
import { notFound } from "next/navigation";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; workspaceSlug: string }>;
}) {
  const { slug, workspaceSlug } = await params;

  const [currOrganisation] = await serverFetch<OrganisationFields[]>(
    `/organisations/${slug}`
  );

  if (!currOrganisation) {
    notFound();
  }

  const workspaces = await serverFetch<WorkspaceFields[]>("/workspaces", {
    headers: {
      "X-Organisation": currOrganisation.id,
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
        orgSlug={slug}
        workspaceSlug={workspaceSlug}
      />
      <div className="flex flex-1 flex-col px-6 py-4">
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
}
