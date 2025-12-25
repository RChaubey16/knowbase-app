import DocumentsList from "@/components/documents/documents-list";
import { serverFetch } from "@/lib/fetch/server";
import { Document } from "@/types/document";
import { OrganisationFields } from "@/types/organisation";
import { WorkspaceFields } from "@/types/workspace";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
    workspaceSlug: string;
  };
}

export default async function WorkspaceDocumentsPage({ params }: PageProps) {
  const { slug, workspaceSlug } = await params;

  const [currOrganisation] = await serverFetch<OrganisationFields[]>(
    `/organisations/${slug}`
  );

  if (!currOrganisation) {
    notFound();
  }

  const [currWorkspace] = await serverFetch<WorkspaceFields[]>(
    `/workspaces/${workspaceSlug}`,
    {
      headers: {
        "X-Organisation-Id": currOrganisation.id,
      },
    }
  );

  console.log(`currWorkspace`, currWorkspace);
  console.log(`ORG SLUG`, slug);
  console.log(`WORKSPACE SLUG`, workspaceSlug);

  const documents = await serverFetch<Document[]>(
    `/workspaces/${currWorkspace.id}/documents`,
    {
      headers: {
        "X-Organisation-Id": currOrganisation.id,
      },
    }
  );

  console.log(`documents`, documents);

  return (
    <div className="space-y-6">
      <main className="flex-1">
        <DocumentsList documents={documents} />
      </main>
    </div>
  );
}
