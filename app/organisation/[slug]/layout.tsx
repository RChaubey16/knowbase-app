import { notFound } from "next/navigation";

import SetOrganisation from "@/app/set-organisation";
import { Sidebar } from "@/components/layout/sidebar";

import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";

export default async function OrganisationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [organisations, orgUser, user] = await Promise.all([
    serverFetch<OrganisationFields[]>("/organisations"),
    serverFetch<{ organisation_members: { role: string } }>(
      `/organisations/${slug}/me`
    ),
    serverFetch<{ userId: string; email: string }>("/auth/me"),
  ]);

  const currOrganisation = organisations.find((org) => org.slug === slug);

  if (!currOrganisation) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      <SetOrganisation orgId={slug} />
      <Sidebar
        organisations={organisations}
        currOrganisation={currOrganisation}
        orgUser={orgUser.organisation_members}
        user={user}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
