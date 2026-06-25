import DocumentsList from "@/components/documents/documents-list";
import { serverFetch } from "@/lib/fetch/server";
import { Document } from "@/types/document";

interface PageProps {
  params: Promise<{ slug: string; workspaceSlug: string }>;
}

export default async function WorkspaceDocumentsPage({ params }: PageProps) {
  const { workspaceSlug, slug } = await params;

  const [documents, user] = await Promise.all([
    serverFetch<Document[]>(`/workspaces/${workspaceSlug}/documents`),
    serverFetch<{ isDemo: boolean }>("/auth/me"),
  ]);

  return (
    <div className="space-y-6">
      <main className="flex-1">
        <DocumentsList
          documents={documents}
          workspaceSlug={workspaceSlug}
          organisationSlug={slug}
          isDemo={user.isDemo}
        />
      </main>
    </div>
  );
}
