import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/fetch/server";
import { getMe } from "@/lib/fetch/cached";
import OrganisationSettingsForm from "@/components/settings/organisation-settings-form";
import OrgMembersSection from "@/components/settings/org-members-section";

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

  const [org, orgUser, user] = await Promise.all([
    serverFetch<Org>(`/organisations/${slug}`),
    serverFetch<{ organisation_members: { role: string } }>(`/organisations/${slug}/me`),
    getMe(),
  ]);

  const role = orgUser.organisation_members.role;

  if (role !== "owner" || user.isDemo) {
    redirect(`/organisation/${slug}`);
  }

  return (
    <div className="p-6 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Organisation Settings</h1>
        <p className="text-muted-foreground mt-1">Manage settings for {org.name}.</p>
      </div>
      <OrganisationSettingsForm org={org} />
      <OrgMembersSection orgSlug={slug} currentMemberRole={role} />
    </div>
  );
}
