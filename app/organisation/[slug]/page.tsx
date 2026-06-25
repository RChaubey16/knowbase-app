import { notFound } from "next/navigation";

import CreateWorkspaceCTA from "@/components/cta/create-workspace-cta";
import WorkspaceCard from "@/components/cards/workspace-card";
import CreateWorkspaceButton from "@/components/buttons/create-workspace-button";

import { serverFetch } from "@/lib/fetch/server";
import { WorkspaceFields } from "@/types/workspace";
import { OrganisationFields } from "@/types/organisation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OrganisationHomePage({ params }: PageProps) {
  const { slug } = await params;

  const [currentOrganisation, workspaces, user] = await Promise.all([
    serverFetch<OrganisationFields>(`/organisations/${slug}`),
    serverFetch<WorkspaceFields[]>("/workspaces", {
      headers: { "X-Organisation": slug },
    }),
    serverFetch<{ isDemo: boolean }>("/auth/me"),
  ]);

  if (!currentOrganisation) {
    notFound();
  }

  const noWorkspaces = workspaces.length === 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans">
      <main className="flex-1 flex flex-col items-center py-20 px-4 md:px-8">
        <div className="w-full max-w-5xl space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {currentOrganisation?.name || slug}
              </h1>
              <p className="text-muted-foreground text-lg">
                {noWorkspaces
                  ? "Select a workspace to view and manage your documents."
                  : "Select a workspace to view and manage your documents."}
              </p>
            </div>

            {!user.isDemo && <CreateWorkspaceButton organisationSlug={slug} />}
          </div>

          {!noWorkspaces ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  organisationSlug={slug}
                />
              ))}
            </div>
          ) : !user.isDemo ? (
            <CreateWorkspaceCTA currOrganisationSlug={slug} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
