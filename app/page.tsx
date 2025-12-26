import { ThemeToggle } from "@/components/theme-toggle";
import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";
import Link from "next/link";

export default async function Home() {
  const data = await serverFetch("/auth/me");
  console.log(`DATA`, data);

  let jsx = (
    <>
      <li>
        <Link href="/login">Login</Link>
      </li>
      <li>
        <Link href="/search">Search</Link>
      </li>
      <li>
        <Link href="/documents">Documents</Link>
      </li>
    </>
  );

  if (data && data.userId) {
    const orgs: OrganisationFields[] = await serverFetch("/organisations");

    jsx = orgs.map((org: OrganisationFields) => (
      <li key={org.id}>
        <Link href={`/organisation/${org.slug}`}>{org.name}</Link>
      </li>
    ));
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background font-sans">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-card sm:items-start">
        <ul>{jsx}</ul>
        <li>
          <Link href="/organisation/create">Create Organisation</Link>
        </li>
      </main>
    </div>
  );
}
