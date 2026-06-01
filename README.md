# Knowbase App

The frontend for Knowbase. A Next.js web application for organising, searching, and managing documents inside workspaces.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square&logo=shadcnui&logoColor=white)
![SWR](https://img.shields.io/badge/SWR-2-black?style=flat-square&logo=vercel&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10.7-F69220?style=flat-square&logo=pnpm&logoColor=white)

> [!WARNING]
> **This project is currently under active development.** Features and APIs may change without notice.

## Tech Stack

| Technology | Role |
|---|---|
| **Next.js 16.1** | Framework — App Router, server components, server actions |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | UI component library (Radix UI primitives) |
| **SWR** | Client-side data fetching and caching |
| **Lucide React** | Icons |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10.7.0+
- The `knowbase-api` backend running on port 3000

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
API_BASE_URL=http://localhost:3000              # server-side only
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000  # exposed to the browser
NEXT_PUBLIC_FE_URL=http://localhost:3001
```

### Running

```bash
pnpm dev    # development server on http://localhost:3001 (webpack, not turbopack)
pnpm build
pnpm start
pnpm lint
```

## Features

- **Google OAuth login** — cookie-based auth with automatic token refresh
- **Multi-tenant** — Organisation → Workspace → Document hierarchy
- **Document management** — Create, edit, soft-delete documents; table and card views
- **Full-text search** — PostgreSQL-backed keyword search with relevance ranking
- **RAG AI search** — Chat-style interface; queries are embedded and answered by Gemini using document context
- **Background indexing status** — Documents in `"processing"` state poll every 4 seconds until `"ready"` or `"failed"`
- **Dynamic pagination** — Document list pages driven by `totalPages`
- **Role-based UI** — Owner-only actions (invite, delete) gated by workspace/org role
- **Dark / light theme** — System preference detected; manually toggleable

## Project Structure

```
app/                          # Next.js App Router pages
  login/                      # Google login page
  organisation/
    create/                   # Create org form
    [slug]/                   # Org layout (sidebar) + org home
      workspaces/
        [workspaceSlug]/      # Workspace layout (top bar, breadcrumbs)
          page.tsx            # Workspace home (placeholder — shows document list)
          documents/          # Full document list
          search/             # Search page (simple + RAG toggle)
  actions/                    # Server Actions (create/update/delete documents)

components/
  layout/                     # Sidebar, top bar, breadcrumbs, workspace switcher
  forms/                      # Document form, create org/workspace, invite members
  modals/                     # Context + Provider wrappers for Dialog popups
  search/                     # Search input, results, AI chat interface
  documents/                  # Document list, action dropdown
  table/                      # Document table view
  cards/                      # Document, workspace, org cards
  ui/                         # shadcn/ui primitives

lib/
  fetch/server.ts             # Fetch wrapper for server components (forwards cookies)
  fetch/client.ts             # Fetch wrapper for client components (handles 401 refresh)
  hooks/                      # SWR hooks: useDocuments, useSearch, useWorkspaces, etc.

types/                        # TypeScript interfaces (Document, Workspace, Organisation)
```

## Known Gaps

- `isIndexed` is not returned by document API responses — the AI search toggle in the edit form always shows unchecked
- "Re-index" action for failed documents is wired in the dropdown but has no API endpoint yet
- Workspace home page (`/page.tsx`) is a placeholder — renders the document list instead of a dashboard
- No member list / remove UI — invite-only for now

## License

Private and proprietary.
