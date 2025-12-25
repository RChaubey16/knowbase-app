interface PageProps {
  params: {
    slug: string;
    workspaceSlug: string;
  };
}

export default async function WorkspaceSearchPage({ params }: PageProps) {
  const { slug, workspaceSlug } = await params;

  console.log(`ORG SLUG`, slug);
  console.log(`WORKSPACE SLUG`, workspaceSlug);


  return (
    <div className="space-y-6">
      Workspace Search page
    </div>
  );
}
