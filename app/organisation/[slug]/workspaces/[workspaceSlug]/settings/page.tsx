import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/fetch/server";
import WorkspaceSettingsForm from "@/components/settings/workspace-settings-form";
import WorkspaceMembersSection from "@/components/settings/workspace-members-section";
import { WorkspaceFields } from "@/types/workspace";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ slug: string; workspaceSlug: string }>;
}) {
  const { slug, workspaceSlug } = await params;

  const [workspace, wsUser] = await Promise.all([
    serverFetch<WorkspaceFields>(`/workspaces/${workspaceSlug}`),
    serverFetch<{ workspace_members: { role: string } }>(`/workspaces/${workspaceSlug}/me`),
  ]);

  if (wsUser.workspace_members.role !== "owner") {
    redirect(`/organisation/${slug}/workspaces/${workspaceSlug}`);
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1">Manage settings for {workspace.name}.</p>
      </div>
      <div className="space-y-6">
        <WorkspaceSettingsForm
          workspace={{ id: String(workspace.id), name: workspace.name, slug: workspace.slug }}
          orgSlug={slug}
        />
        <WorkspaceMembersSection
          workspaceSlug={workspaceSlug}
          orgSlug={slug}
        />
      </div>
    </div>
  );
}
