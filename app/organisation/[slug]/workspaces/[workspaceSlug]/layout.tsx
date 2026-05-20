import { TopBar } from "@/components/layout/top-bar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

import { serverFetch } from "@/lib/fetch/server";
import { WorkspaceFields } from "@/types/workspace";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; workspaceSlug: string }>;
}) {
  const { slug, workspaceSlug } = await params;

  const workspaces = await serverFetch<WorkspaceFields[]>("/workspaces", {
    headers: {
      "X-Organisation": slug,
    },
  });
  const noWorkspaces = workspaces.length === 0;

  const wsUser = await serverFetch<{ workspace_members: { role: string } }>(
    `/workspaces/${workspaceSlug}/me`
  );

  return (
    <>
      <TopBar
        indexStatus="ready"
        noWorkspaces={noWorkspaces}
        workspaces={workspaces}
        orgSlug={slug}
        workspaceSlug={workspaceSlug}
        wsUserRole={wsUser.workspace_members.role}

      />
      <div className="flex flex-1 flex-col px-6 py-4">
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
}
