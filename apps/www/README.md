# Fan Engagement App

A modern web application for fan engagement built with Next.js and TypeScript. This application provides features for user authentication, quests, leaderboards, and profile management.

## Tech Stack

- **Framework:** Next.js 14 with TypeScript
- **Routing:** Next.js App Router
- **State Management:**

  - Zustand for global state
  - React Query for server state
- **Styling:**
  - TailwindCSS
  - shadcn/ui components
- **Form Handling:** React Hook Form with Zod validation
- **Development:**
  - ESLint for code linting
  - TypeScript for type safety
- **Authentication:** [@keypom/fastauth](https://www.npmjs.com/package/@keypom/fastauth)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- Bun package manager (`npm install -g bun`)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

## Development

Run the development server:

```bash
bun dev
```

Other available commands:

- `bun run build` - Build the production application
- `bun run lint` - Run ESLint
- `bun run start` - Start the production server

## Project Structure

```txt
src/
├── app/                # Next.js App Router pages and layouts
│   ├── (auth)/        # Authentication related pages
│   ├── login/         # Login page
│   └── page.tsx       # Home page
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (shadcn/ui)
│   └── modals/        # Modal components
├── lib/               # Utilities and shared code
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions
├── near/              # NEAR blockchain integration
└── styles/            # Global styles
```

## Features

- **Authentication** - NEAR Wallet integration for secure login
- **Quests** - User engagement activities
- **Leaderboard** - Competitive rankings
- **Profile Management** - User profile customization
- **Responsive Design** - Mobile-first approach with bottom navigation
