# Architecture

## System Overview

A full-stack portfolio application deployed as a single Cloudflare Worker. The frontend (React/Vite) is served as static assets, while the backend (Hono) handles API requests, authentication, and integrations — all within the same deployment unit.

```
┌─────────────────────────────────────────────────────┐
│                  Cloudflare Worker                   │
│                                                     │
│  ┌──────────────┐         ┌──────────────────────┐  │
│  │  Static Assets│         │    Hono API Server   │  │
│  │  (React/Vite) │         │                      │  │
│  │              │  /api/*  │  Routes → Controllers │  │
│  │  SPA Client  │────────▶│  → Services → Repos   │  │
│  │              │         │                      │  │
│  └──────────────┘         └──────┬───────┬───────┘  │
│                                  │       │          │
│                           ┌──────┘       └──────┐   │
│                           ▼                     ▼   │
│                    ┌────────────┐     ┌──────────┐  │
│                    │ Cloudflare │     │Cloudflare│  │
│                    │     D1     │     │  Stream  │  │
│                    └────────────┘     └──────────┘  │
└─────────────────────────────────────────────────────┘
            │                               ▲
            │                               │
            ▼                               │
     ┌─────────────┐              ┌─────────┴────────┐
     │ Better Auth  │              │  Direct Upload   │
     │ Google OAuth │              │  (Client → Stream)│
     └─────────────┘              └──────────────────┘
```

## Core Components

### Frontend (React + Vite)
- **Public pages**: Homepage, about, experience, stack, projects list, project detail with video player
- **Admin pages**: Login, project CRUD, video upload, technology management
- **Routing**: React Router for SPA navigation
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Zod (shared schemas with backend)

### Backend (Hono)
- **Routes**: Define HTTP endpoints, map to controllers
- **Controllers**: Parse requests, call services, format responses
- **Services**: Business logic, orchestration, authorization checks
- **Repositories**: Data access via Drizzle ORM against D1
- **Integrations**: Cloudflare Stream API adapter
- **Validators**: Zod schemas for request validation

### Authentication (Better Auth)
- Google OAuth as the sole provider (MVP)
- Database-persisted sessions in D1
- Middleware-based route protection on Hono
- Simple admin role (single authorized user)

### Database (Cloudflare D1 + Drizzle)
- D1 as the relational database (SQLite-compatible)
- Drizzle ORM for type-safe queries
- Drizzle Kit for migration generation
- SQL migrations as source of truth

### Video (Cloudflare Stream)
- Backend generates signed upload URLs
- Client uploads directly to Stream (video never passes through backend)
- Backend stores video metadata (stream ID, status)
- Frontend embeds Stream player for playback

## Directory Structure

```
portfolio/
├── src/                    # Frontend (React)
│   ├── components/         # UI components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities, API client
│   └── styles/             # Global styles
├── server/                 # Backend (Hono)
│   ├── routes/             # Route definitions
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── repositories/       # Data access layer
│   ├── integrations/       # External service adapters
│   ├── validators/         # Zod schemas
│   └── middleware/         # Auth, error handling
├── worker/                 # Cloudflare Worker entrypoint
│   └── index.ts
├── drizzle/                # Database
│   ├── schema.ts           # Drizzle schema definitions
│   └── migrations/         # SQL migration files
├── shared/                 # Shared types and schemas
│   ├── types/
│   └── validators/
├── scripts/                # Dev tooling scripts
├── tests/                  # Test files
│   ├── unit/
│   └── integration/
├── public/                 # Static assets
├── wrangler.toml           # Cloudflare config
├── drizzle.config.ts
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

## Design Patterns

- **Repository Pattern**: Abstract data access behind interfaces, enabling testability
- **Service Layer**: Encapsulate business logic separate from HTTP concerns
- **DTOs**: Define clear data shapes for API boundaries
- **Adapter Pattern**: Wrap external services (Stream) behind stable interfaces
- **Factory/Builder**: Construct complex entities (projects with relations)

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Single repo, single Worker | Simplicity — one deploy unit, shared types, no cross-service coordination |
| D1 over external DB | Native Cloudflare integration, no cold-start latency to external DB |
| Drizzle over raw SQL | Type safety, migration tooling, lightweight enough for Workers |
| Better Auth over custom | Battle-tested OAuth flows, session management, D1 adapter available |
| Direct-to-Stream uploads | Avoids Worker body size limits and unnecessary bandwidth costs |
| Hono over itty-router | Middleware ecosystem, Better Auth integration, familiar Express-like API |
