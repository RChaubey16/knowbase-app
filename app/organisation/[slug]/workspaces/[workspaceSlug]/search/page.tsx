import SearchDocuments from "@/components/search/search-documents";

export default async function WorkspaceSearchPage({
  params,
}: {
  params: { workspaceSlug: string, slug: string };
}) {
  const { workspaceSlug, slug } = await params;

  return (
    <div className="flex min-h-screen">
      <SearchDocuments organisationSlug={slug} workspaceSlug={workspaceSlug} />
    </div>
  );
}
