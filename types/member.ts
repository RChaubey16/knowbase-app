export interface OrgMember {
  id: string;
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

export interface WorkspaceMember {
  id: string;
  organisationMemberId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: "owner" | "admin" | "editor" | "viewer";
  joinedAt: string;
}
