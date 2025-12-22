import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar title="Documents" indexStatus="ready" type="documents" />
        <main className="flex-1">
          <DocumentsList />
        </main>
      </div>
    </div>
  );
}
