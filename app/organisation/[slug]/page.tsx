import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";
import { serverFetch } from "@/lib/fetch/server";
import { Document } from "@/types/document";
import { OrganisationFields } from "@/types/organisation";
import { WorkspaceFields } from "@/types/workspace";
import { redirect } from "next/navigation";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function OrganisationHomePage({ params }: PageProps) {
  const { slug } = await params;

  const [organisation] = await serverFetch<OrganisationFields[]>(
    `/organisations/${slug}`
  );

  if (!organisation) {
    redirect("/organisation/create");
  }

  const workspaces = await serverFetch<WorkspaceFields[]>("/workspaces", {
    headers: { "X-Organisation-Id": organisation.id },
  });

  const noWorkspaces = workspaces.length === 0;

  const documents = !noWorkspaces
    ? await serverFetch<Document[]>(
        `/workspaces/${workspaces[0].id}/documents`,
        { headers: { "X-Organisation-Id": organisation.id } }
      )
    : [];

  return (
    <>
      <TopBar
        title="Documents"
        indexStatus="ready"
        type="documents"
        noWorkspaces={noWorkspaces}
        workspaces={workspaces}
      />
      {noWorkspaces ? (
        <CreateWorkspaceCTA />
      ) : (
        <main className="flex-1">
          <DocumentsList documents={documents} />
        </main>
      )}
    </>
  );
}
