import SetOrganisation from "@/app/set-organisation";
import { Sidebar } from "@/components/layout/sidebar";
import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";
import { notFound } from "next/navigation";

export default async function OrganisationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const organisations = await serverFetch<OrganisationFields[]>(
    "/organisations",
    { next: { revalidate: 300 } }
  );

  const currOrganisation = organisations.find((org) => org.slug === slug);

  if (!currOrganisation) {
    notFound();
  }

  const orgUser = await serverFetch<{ organisation_members: { role: string } }>(
    `/organisations/${slug}/me`
  );

  return (
    <div className="flex min-h-screen">
      <SetOrganisation orgId={slug} />
      <Sidebar
        organisations={organisations}
        currOrganisation={currOrganisation}
        orgUser={orgUser.organisation_members}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
