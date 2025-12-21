# 📚 KnowBase App

A modern, full-featured knowledge base application built with Next.js 16, designed to help you organize, search, and manage your documents efficiently.

> [!WARNING]
> **This project is currently under active development.** Features and APIs may change without notice.

## ✨ Features

- 🔍 **Semantic Search** - Powerful search functionality with relevance scoring
- 📄 **Document Management** - Organize and manage documents with multiple view options (table/grid)
- 🎨 **Modern UI** - Clean, responsive interface built with shadcn/ui components
- 🌓 **Dark Mode** - Full dark/light theme support with system preference detection
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎯 **Type-Safe** - Built with TypeScript for enhanced developer experience
- ⚡ **Fast Performance** - Leveraging Next.js 16 App Router and React 19

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm 10.7.0+ (recommended package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd knowbase-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

### UI Components
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Radix UI Primitives**: Accessible, unstyled components
- **Theme Management**: next-themes

### Development Tools
- **Linting**: ESLint 9
- **Package Manager**: pnpm

## 📁 Project Structure

```
knowbase-app/
├── app/                    # Next.js App Router pages
│   ├── documents/         # Document management page
│   ├── search/            # Search interface
│   ├── login/             # Authentication (in development)
│   ├── layout.tsx         # Root layout with theme provider
│   └── globals.css        # Global styles and theme variables
├── components/            # React components
│   ├── documents/         # Document-related components
│   ├── search/            # Search components
│   ├── layout/            # Layout components (TopBar, etc.)
│   ├── forms/             # Form components
│   ├── cards/             # Card components
│   ├── table/             # Table components
│   ├── ui/                # shadcn/ui components
│   └── theme-toggle.tsx   # Theme switcher component
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🎨 Design System

The application uses a custom design system with:
- **Typography**: Montserrat font family
- **Color Palette**: Carefully crafted light and dark themes
- **Components**: Consistent, reusable UI components from shadcn/ui
- **Animations**: Smooth transitions and micro-interactions

## 📝 Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## 🔮 Planned Features

- [ ] User authentication and authorization
- [ ] Document upload and processing
- [ ] Vector-based semantic search integration
- [ ] Document chunking and embedding
- [ ] Workspace management
- [ ] Advanced filtering and sorting
- [ ] Document tagging and categorization
- [ ] Export functionality
- [ ] API integration with backend services

## 🤝 Contributing

This project is currently in active development. Contribution guidelines will be added soon.

## 📄 License

This project is private and proprietary.

## 🔗 Related Projects

- [knowbase-api](https://github.com/RChaubey16/knowbase-api) - Backend API service (if applicable)

---

**Note**: This is a work-in-progress project. Features, documentation, and structure are subject to change as development continues.
