import { Sidebar } from "@/components/layout/sidebar";
import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";
import { notFound } from "next/navigation";

export default async function OrganisationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
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

  return (
    <div className="flex min-h-screen">
      <Sidebar
        organisations={organisations}
        currOrganisation={currOrganisation}
      />
      <div className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
