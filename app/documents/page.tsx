import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";

export default function DocumentsPage() {
  const noWorkspaces = true;
  return (
    <div className="flex min-h-screen">
      <Sidebar />

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
