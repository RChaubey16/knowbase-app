import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";
import { serverFetch } from "@/lib/fetch/server";
import { Document } from "@/types/document";
import { WorkspaceFields } from "@/types/workspace";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function OrganisationHomePage({ params }: PageProps) {
  const { slug } = await params;

  const workspaces = await serverFetch<WorkspaceFields[]>("/workspaces");

  const noWorkspaces = workspaces.length === 0;

  const documents = !noWorkspaces
    ? await serverFetch<Document[]>(`/workspaces/${workspaces[0].id}/documents`)
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
