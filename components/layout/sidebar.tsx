"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Search, Menu, X, UserPlus, Settings, LogOut } from "lucide-react";

import { WorkspaceSwitcher } from "./workspace-switcher";
import { OrganisationFields } from "@/types/organisation";
import {
  InviteMembersModalProvider,
  useInviteMembersModal,
} from "../modals/invite-members-modal";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { clientFetch } from "@/lib/fetch/client";

// Utility function for className merging
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

interface SidebarProps {
  organisations: OrganisationFields[];
  currOrganisation: OrganisationFields;
  orgUser: {
    role: string;
  };
  user: {
    userId: string;
    email: string;
  };
}

export function Sidebar(props: SidebarProps) {
  return (
    <InviteMembersModalProvider>
      <SidebarContent {...props} />
    </InviteMembersModalProvider>
  );
}

export function SidebarContent({
  organisations,
  currOrganisation,
  orgUser,
  user,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { open: openInvite } = useInviteMembersModal();
  const segments = pathname.split("/").filter(Boolean);
  const currentSection = segments.at(-1);
  const isUserOwner = orgUser.role === "owner";

  const handleLogout = async () => {
    try {
      await clientFetch("/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  };

  const workspacesIdx = segments.indexOf("workspaces");
  const isInWorkspace = workspacesIdx !== -1 && segments.length > workspacesIdx + 1;
  const workspaceBase = isInWorkspace
    ? "/" + segments.slice(0, workspacesIdx + 2).join("/")
    : null;

  const navItems = isInWorkspace
    ? [
        { name: "Documents", icon: FileText, href: `${workspaceBase}/documents` },
        { name: "Search", icon: Search, href: `${workspaceBase}/search` },
      ]
    : [];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-lg lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground border-sidebar-border transition-transform duration-300 lg:translate-x-0 lg:static",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
              K
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Knowbase
            </span>
          </Link>
        </div>

        {/* Organisation Switcher */}
        <div className="border-b border-sidebar-border px-4 py-4">
          <WorkspaceSwitcher
            swticherTitle="Organisations"
            buttonText="organisation"
            spaces={organisations}
            selectedSpace={currOrganisation}
            userRole={orgUser.role}
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const section = item.name.toLowerCase();
            const isActive = currentSection === section;

            return (
              <Link
                key={section}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* {isUserOwner && (
            <Button
              variant="outline"
              className="w-fit word-wrap button bg-transparent border-primary/20 hover:bg-primary/5 text-foreground"
              disabled={!currOrganisation.slug}
              onClick={() => openInvite(currOrganisation.slug, "")}
            >
              <UserPlus className="h-4 w-4 stroke-2" />
              Invite to {currOrganisation.name}
            </Button>
          )} */}
        </nav>

        {isUserOwner && (
          <div className="border-t border-sidebar-border px-3 py-3">
            <Link
              href={`/organisation/${currOrganisation.slug}/settings`}
              onClick={closeMobileMenu}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                currentSection === "settings"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
        )}

        {/* User footer */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground uppercase">
                  {user.email[0]}
                </div>
                <span className="flex-1 truncate text-left text-sidebar-foreground">
                  {user.email}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
