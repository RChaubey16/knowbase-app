import { cache } from "react";
import { serverFetch } from "./server";

export interface AuthUser {
  userId: string;
  email: string;
  isDemo: boolean;
}

// Deduplicates /auth/me per render pass — layout and pages share one HTTP call
export const getMe = cache(() => serverFetch<AuthUser>("/auth/me"));
