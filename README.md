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

- **Google OAuth login** — cookie-based auth with automatic token refresh and redirect on 401
- **Multi-tenant** — Organisation → Workspace → Document hierarchy with role-based UI gating
- **Document management** — Create (text, URL, PDF), edit, and soft-delete documents; table and card views with snippet previews
- **Document types** — Text editor, URL ingestion (auto-scrapes page content), PDF upload (up to 10 MB)
- **Full-text search** — PostgreSQL-backed keyword search with relevance ranking
- **RAG AI search** — Semantic search powered by Jina AI embeddings and Gemini; results rendered as a generated answer
- **Background indexing** — Processing documents poll every 4 seconds; failed documents can be re-indexed via dropdown action
- **Member management** — Invite members by email; list, remove, and change roles for org and workspace members from the Settings page
- **Organisation settings** — Rename org, manage members, delete org (owner only)
- **Workspace settings** — Rename workspace, manage members, delete workspace (owner only)
- **Workspace dashboard** — Stat cards (total / ready / processing / failed) and recent documents with quick actions
- **Dynamic pagination** — Document list pages driven by `totalPages` from the API
- **Markdown rendering** — Document content renders with `react-markdown` + `remark-gfm` (headings, tables, code blocks, etc.)
- **Dark / light theme** — System preference detected; manually toggleable

## Project Structure

```
app/
  login/                        # Google login page
  organisation/
    create/                     # Create org form
    [slug]/                     # Org layout (sidebar, org role)
      page.tsx                  # Org home — lists workspaces
      settings/                 # Org settings: rename, members, delete (owner only)
      workspaces/
        [workspaceSlug]/        # Workspace layout (top bar, breadcrumbs)
          page.tsx              # Workspace dashboard (stats + recent docs)
          documents/            # Full document list with pagination
          search/               # Search page (simple FTS + RAG toggle)
          settings/             # Workspace settings: rename, members, delete (owner only)
  actions/                      # Server Actions (create/update/delete documents, set org cookie)

components/
  layout/                       # Sidebar, top bar, breadcrumbs, workspace switcher
  forms/                        # Document form (text/URL/PDF), create org/workspace, invite members
  modals/                       # Context + Provider wrappers for Dialog popups
  search/                       # Search input, results, AI chat interface
  documents/                    # Document list, action dropdown
  workspace/                    # Workspace dashboard
  settings/                     # Org/workspace settings forms + members sections
  table/                        # Document table view
  cards/                        # Document, workspace, org cards
  ui/                           # shadcn/ui primitives

lib/
  fetch/server.ts               # Fetch wrapper for server components (forwards cookies + X-Organisation)
  fetch/client.ts               # Fetch wrapper for client components (handles 401 → refresh → retry)
  hooks/
    use-documents.ts            # CRUD + reindex + PDF upload; auto-polls processing docs
    use-search.ts               # Debounced search with mode toggle
    use-workspaces.ts           # Workspace CRUD
    use-organisations.ts        # Org CRUD
    use-org-members.ts          # Org member list, remove, role change
    use-workspace-members.ts    # Workspace member list, remove

types/                          # TypeScript interfaces (Document, Workspace, Organisation, Member)
```

## License

Private and proprietary.
