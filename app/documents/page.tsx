import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import { OrganisationFields } from "@/types/organisation";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { WorkspaceFields } from "@/types/workspace";
import { Document } from "@/types/document";
import { serverFetch } from "@/lib/fetch/server";

export default async function DocumentsPage() {
  try {
    const organisation: OrganisationFields[] = await serverFetch('/organisations')

    
    if (!organisation?.[0]) {
      redirect('/organisation/create')
    }

    const orgId = organisation[0].id

    // Step 2: Get workspaces
    const workspaces: WorkspaceFields[] = await serverFetch('/workspaces', {
      headers: { 'X-Organisation-Id': orgId }
    })

    const noWorkspaces = !workspaces || workspaces.length === 0

    // Step 3: Get documents (only if workspaces exist)
    const documents: Document[] = !noWorkspaces
      ? await serverFetch<Document[]>(`/workspaces/${workspaces[0].id}/documents`, {
          headers: { 'X-Organisation-Id': orgId }
        })
      : []

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
    if (error instanceof Error && error.message.includes("401")) {
      redirect("/login");
    }
    return <ErrorBoundary error={error} />
  }
}
