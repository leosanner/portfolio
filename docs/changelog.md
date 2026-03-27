# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup (React/Vite, Hono, Tailwind CSS, ESLint, Prettier, Vitest)
- Project documentation (architecture, spec, changelog)
- CLAUDE.md configuration
- Drizzle ORM schema with 9 tables: user, session, account, verification (auth), project, technology, project_technology, project_link, project_video (domain)
- Initial D1 migration (`0000_outgoing_dormammu.sql`)
- Better Auth integration with Google OAuth provider (`server/auth.ts`)
- Auth middleware with admin email restriction (`server/middleware/auth.ts`)
- Hono routes: `/api/health`, `/api/auth/*`, `/api/me`
- React auth client with `signIn`, `signOut`, `useSession` (`src/lib/auth-client.ts`)
- Shared Bindings and AppEnv types (`shared/types/env.ts`)
- Cloudflare adapter for Vite dev server (D1 bindings in local dev)
- `.dev.vars` template for local environment secrets
