import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import { serverFetcher } from "@/lib/serrver-api";
import { OrganisationFields } from "@/types/organisation";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { WorkspaceFields } from "@/types/workspace";

export default async function DocumentsPage() {
  try {
    // Step 1: Get organisation
    const organisation: OrganisationFields[] = await serverFetcher('/organisations')
    
    if (!organisation?.[0]) {
      redirect('/organisation/create')
    }

    const orgId = organisation[0].id

    // Step 2: Get workspaces
    const workspaces: WorkspaceFields[] = await serverFetcher('/workspaces', {
      headers: { 'X-Organisation-Id': orgId }
    })

    const noWorkspaces = !workspaces || workspaces.length === 0

    // Step 3: Get documents (only if workspaces exist)
    const documents = !noWorkspaces
      ? await serverFetcher(`/workspaces/${workspaces[0].id}/documents`, {
          headers: { 'X-Organisation-Id': orgId }
        })
      : []

    console.log(`documents`, documents)

    return (
      <div className="flex min-h-screen">
        <Sidebar organisations={organisation} />
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
    )
  } catch (error) {
    console.error('Page load error:', error)
    return <ErrorBoundary error={error} />
  }
}
