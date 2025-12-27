import DocumentsList from "@/components/documents/documents-list";
import { serverFetch } from "@/lib/fetch/server";
import { Document } from "@/types/document";

interface PageProps {
  params: Promise<{ slug?: string; workspaceSlug: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { workspaceSlug } = await params;

  const documents = await serverFetch<Document[]>(
    `/workspaces/${workspaceSlug}/documents`
  );

  return (
    <div className="space-y-6">
      <main className="flex-1">
        <DocumentsList documents={documents} workspaceSlug={workspaceSlug} />
      </main>
    </div>
  );
}
