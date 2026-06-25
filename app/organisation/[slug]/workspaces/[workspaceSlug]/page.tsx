import { serverFetch } from "@/lib/fetch/server";
import { Document } from "@/types/document";
import { WorkspaceFields } from "@/types/workspace";
import { WorkspaceDashboard } from "@/components/workspace/workspace-dashboard";

interface PageProps {
  params: Promise<{ slug: string; workspaceSlug: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { workspaceSlug, slug } = await params;

  const [documents, workspace, user] = await Promise.all([
    serverFetch<Document[]>(`/workspaces/${workspaceSlug}/documents?limit=50`),
    serverFetch<WorkspaceFields>(`/workspaces/${workspaceSlug}`),
    serverFetch<{ isDemo: boolean }>("/auth/me"),
  ]);

  return (
    <WorkspaceDashboard
      documents={documents}
      workspace={workspace}
      organisationSlug={slug}
      workspaceSlug={workspaceSlug}
      isDemo={user.isDemo}
    />
  );
}
