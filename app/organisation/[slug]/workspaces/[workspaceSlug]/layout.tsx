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

  const [workspaces, wsUser, user] = await Promise.all([
    serverFetch<WorkspaceFields[]>("/workspaces", {
      headers: { "X-Organisation": slug },
    }),
    serverFetch<{ workspace_members: { role: string } }>(
      `/workspaces/${workspaceSlug}/me`
    ),
    serverFetch<{ isDemo: boolean }>("/auth/me"),
  ]);
  const noWorkspaces = workspaces.length === 0;

  return (
    <>
      <TopBar
        indexStatus="ready"
        noWorkspaces={noWorkspaces}
        workspaces={workspaces}
        orgSlug={slug}
        workspaceSlug={workspaceSlug}
        wsUserRole={wsUser.workspace_members.role}
        isDemo={user.isDemo}
      />
      <div className="flex flex-1 flex-col px-6 py-4">
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
}
