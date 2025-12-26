import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";
import { WorkspaceFields } from "@/types/workspace";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OrganisationHomePage({ params }: PageProps) {
  const { slug } = await params;

  const [currOrganisation] = await serverFetch<OrganisationFields[]>(
    `/organisations/${slug}`
  );

  if (!currOrganisation) {
    notFound();
  }

  const workspaces = await serverFetch<WorkspaceFields[]>("/workspaces");
  const noWorkspaces = workspaces.length === 0;

  if (!noWorkspaces) {
    const [workspace] = workspaces;
    redirect(`/organisation/${slug}/workspaces/${workspace.slug}/documents`)
  }

  return (
    <>
      {!noWorkspaces &&
        workspaces.map((workspace) => (
          <Link
            href={`/organisation/${slug}/workspaces/${workspace.slug}/documents`}
            key={workspace.id}
          >
            {workspace.name}
          </Link>
        ))}

      {noWorkspaces && <CreateWorkspaceCTA organisationId={currOrganisation.id} currOrganisationSlug={slug} />}
    </>
  );
}
