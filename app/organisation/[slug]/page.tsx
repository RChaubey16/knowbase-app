import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import DocumentsList from "@/components/documents/documents-list";
import { Sidebar } from "@/components/layout/sidebar";
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

  const organisations = await serverFetch<OrganisationFields[]>(
    `/organisations/${slug}`
  );

  console.log(`organisations`, organisations)

  if (!organisations.length) {
    redirect("/organisation/create");
  }

  const org = organisations[0];

  const workspaces = await serverFetch<WorkspaceFields[]>("/workspaces", {
    headers: { "X-Organisation-Id": org.id },
  });

  const noWorkspaces = workspaces.length === 0;

  const documents = !noWorkspaces
    ? await serverFetch<Document[]>(
        `/workspaces/${workspaces[0].id}/documents`,
        { headers: { "X-Organisation-Id": org.id } }
      )
    : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar organisations={organisations} />
      <div className="flex flex-1 flex-col">
        <TopBar
          title="Documents"
          indexStatus="ready"
          type="documents"
          workspaces={workspaces}
        />
        {noWorkspaces ? (
          <CreateWorkspaceCTA />
        ) : (
          <main className="flex-1">
            <DocumentsList documents={documents} />
          </main>
        )}
      </div>
    </div>
  );
}

