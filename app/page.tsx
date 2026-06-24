import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import OrganisationCard from "@/components/cards/organisation-card";
import { UserMenu } from "@/components/layout/user-menu";

import { serverFetch } from "@/lib/fetch/server";
import { OrganisationFields } from "@/types/organisation";

export default async function Home() {
  const data: { userId: string; email: string } = await serverFetch("/auth/me");

  let organisations: OrganisationFields[] = [];

  if (data && data.userId) {
    organisations = await serverFetch("/organisations");
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {data?.email && <UserMenu email={data.email} />}
        <ThemeToggle />
      </div>

      <main className="flex-1 flex flex-col items-center py-20 px-4 md:px-8">
        <div className="w-full max-w-5xl space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Your Organisations
              </h1>
              <p className="text-muted-foreground text-lg">
                Select an organisation to view your workspaces and documents.
              </p>
            </div>

            <Link href="/organisation/create">
              <Button
                size="lg"
                className="rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Organisation
              </Button>
            </Link>
          </div>

          {!data || !data.userId ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-border p-12 text-center">
              <h2 className="text-2xl font-semibold mb-4">Welcome back</h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-md">
                Please login to access your organisations and start managing
                your knowledge base.
              </p>
              <Link href="/login">
                <Button size="lg" className="rounded-full px-12">
                  Login
                </Button>
              </Link>
            </div>
          ) : organisations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {organisations.map((org) => (
                <OrganisationCard key={org.id} organisation={org} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-card/50 rounded-3xl border border-dashed border-border p-12 text-center">
              <h2 className="text-xl font-semibold mb-2">
                No organisations found
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first organisation to get started.
              </p>
              <Link href="/organisation/create">
                <Button variant="outline" className="rounded-full">
                  Create Organisation
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 px-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} KnowBase. All rights reserved.</p>
      </footer>
    </div>
  );
}
