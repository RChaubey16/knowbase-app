import DocumentsList from "@/components/documents/documents-list";
import { TopBar } from "@/components/layout/top-bar";

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar title="Documents" indexStatus="ready" type="documents" />
      <main className="flex-1">
        <DocumentsList />
      </main>
    </div>
  );
}
