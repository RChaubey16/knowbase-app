import { ThemeToggle } from "@/components/theme-toggle";
import { serverFetch } from "@/lib/fetch/server";
import Link from "next/link";

export default async function Home() {
  const data = await serverFetch('/auth/me')
  console.log(`DATA`, data)
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background font-sans">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-card sm:items-start">
        <ul>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/search">Search</Link>
          </li>
          <li>
            <Link href="/documents">Documents</Link>
          </li>
          <li>
            <Link href="/organisation/create">Create Organisation</Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
