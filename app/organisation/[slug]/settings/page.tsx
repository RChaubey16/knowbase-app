import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/fetch/server";
import OrganisationSettingsForm from "@/components/settings/organisation-settings-form";

interface Org {
  id: string;
  name: string;
  slug: string;
}

export default async function OrganisationSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [org, orgUser] = await Promise.all([
    serverFetch<Org>(`/organisations/${slug}`),
    serverFetch<{ organisation_members: { role: string } }>(`/organisations/${slug}/me`),
  ]);

  if (orgUser.organisation_members.role !== "owner") {
    redirect(`/organisation/${slug}`);
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Organisation Settings</h1>
        <p className="text-muted-foreground mt-1">Manage settings for {org.name}.</p>
      </div>
      <OrganisationSettingsForm org={org} />
    </div>
  );
}
