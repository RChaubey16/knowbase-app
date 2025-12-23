import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import { serverFetcher } from "@/lib/serrver-api";
import { OrganisationFields } from "@/types/organisation";

export default async function DocumentsPage() {
  const noWorkspaces = true;
  const data: OrganisationFields[] = await serverFetcher('/organisations')

  return (
    <div className="flex min-h-screen">
      <Sidebar organisations={data} />

      <div className="flex flex-1 flex-col">
        <TopBar title="Documents" indexStatus="ready" type="documents" />
        {noWorkspaces ? (
          <CreateWorkspaceCTA />
        ) : (
          <>
            <main className="flex-1">
              <DocumentsList />
            </main>
          </>
        )}
      </div>
    </div>
  );
}
