# CLAUDE.md

## Project Overview

A full-stack portfolio application built with React/Vite (frontend) and Hono (backend), deployed as a single Cloudflare Worker. The app showcases projects with video explanations via Cloudflare Stream, uses Google OAuth via Better Auth for admin authentication, and stores data in Cloudflare D1 with Drizzle ORM.

## Documentation

- [Architecture](docs/architecture.md) — System design, components, data flow, and tech stack rationale
- [Project Spec](docs/project_spec.md) — Requirements, API contracts, data models, and milestones
- [Changelog](docs/changelog.md) — Track of all notable changes

## Tech Stack

- **Frontend**: React, Vite, TypeScript, React Router, Tailwind CSS, shadcn/ui
- **Backend**: Hono, TypeScript, Cloudflare Workers runtime
- **Auth**: Better Auth with Google OAuth provider
- **Database**: Cloudflare D1, Drizzle ORM, Drizzle Kit (migrations)
- **Video**: Cloudflare Stream (direct upload, embedded player)
- **Testing**: Vitest, Testing Library, TDD mandatory
- **Quality**: ESLint, Prettier
- **CI/CD**: GitHub Actions, Wrangler

## Development Guidelines

- **TDD**: Write tests first. All business logic must have corresponding tests.
- **TypeScript**: Strict mode. Shared Zod schemas for validation across frontend and backend.
- **Architecture**: Simplified MVC + Service Layer. Keep layers decoupled — controllers call services, services call repositories.
- **Patterns**: Repository Pattern for data access, Adapter Pattern for external integrations (Stream), DTOs at API boundaries.
- **Database**: No Docker for local DB. Use D1 via Wrangler/Miniflare. Reset and reapply migrations in dev. SQL migrations are source of truth.
- **Video**: Videos must never pass through the backend. Use signed upload URLs for direct client-to-Stream uploads.
- **Simplicity**: Avoid premature abstractions. Start simple, evolve safely. No features beyond what's specified.

## Build & Run Commands

```bash
# Install dependencies
npm install

# Local development (Wrangler dev server)
npm run dev

# Run tests
npm run test

# Lint
npm run lint

# Type check
npm run typecheck

# Generate migration
npm run db:generate

# Apply migrations (local)
npm run db:migrate

# Deploy
npm run deploy
```

## Project Structure

```
src/              → Frontend React application
server/           → Backend Hono API (routes, controllers, services, repositories)
worker/           → Cloudflare Worker entrypoint
drizzle/          → Database schema and SQL migrations
shared/           → Shared types and Zod validators
scripts/          → Dev tooling scripts
tests/            → Unit and integration tests
public/           → Static assets
```

## Environment Variables

- `BETTER_AUTH_SECRET` — Auth session encryption secret
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `CLOUDFLARE_API_TOKEN` — Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID
- `STREAM_TOKEN` — Cloudflare Stream API token
