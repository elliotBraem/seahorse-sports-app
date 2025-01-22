# Fan Engagement App

A modern web application for fan engagement built with React and TypeScript. This application provides features for user authentication, quests, leaderboards, and profile management.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** TanStack Router (file-based routing)
- **State Management:** 
  - Zustand for global state
  - TanStack Query for server state
- **Styling:** 
  - TailwindCSS
  - shadcn/ui components
- **Form Handling:** React Hook Form with Zod validation
- **Development:**
  - ESLint for code linting
  - TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- Bun package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

## Development

Run the development server:

```bash
bun run dev
```

Other available commands:
- `bun run build` - Build the production application
- `bun run lint` - Run ESLint
- `bun run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (shadcn/ui)
│   └── ...           
├── routes/            # File-based routing
│   ├── _layout/       # Layout components
│   │   ├── _authenticated/    # Protected routes
│   │   └── _unauthenticated/  # Public routes
├── lib/               # Utilities and shared code
├── hooks/             # Custom React hooks
└── main.tsx          # Application entry point
```

## Features

- **Authentication** - Protected and public routes
- **Quests** - User engagement activities
- **Leaderboard** - Competitive rankings
- **Profile Management** - User profile customization
- **Responsive Design** - Mobile-first approach with bottom navigation
