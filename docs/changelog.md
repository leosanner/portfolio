# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- Dev server port flexibility: removed hardcoded port, Vite auto-picks available port
- Auth URLs now derived dynamically (`window.location.origin` on client, request URL on server) instead of hardcoded localhost:5173
- Better Auth database adapter switched from raw D1 (Kysely, camelCase) to Drizzle adapter with schema, fixing snake_case column mismatch errors
- `trustedOrigins` in dev now accepts any localhost port

### Added

#### Phase 2 — Admin UI
- React Router setup with public and `/admin` routes
- Google OAuth login page via Better Auth
- AuthGuard component for protected admin routes
- Admin layout with sidebar navigation and sign out
- Technology management page (inline create/edit, table with delete)
- Project management pages (list with status badges, create/edit form with markdown description, technology selection, links management)
- Admin API endpoints: `GET /api/projects/admin/all`, `GET /api/projects/admin/:id`
- API client helper (`src/lib/api.ts`)

#### Phase 2 — Project CRUD (Backend)
- Custom error classes (AppError, NotFoundError, ConflictError, ValidationError) and global error handler middleware
- Shared Zod validators for project and technology create/update operations
- Slugify utility for auto-generating URL slugs from titles (with collision handling)
- Technology CRUD: `GET /api/technologies` (public), `POST/PATCH/DELETE /api/technologies/:id` (admin)
- Project CRUD: `GET /api/projects` (published only), `GET /api/projects/:slug`, `POST/PATCH/DELETE /api/projects/:id` (admin)
- Project links managed as nested data within project create/update
- Project-technology associations via join table
- Repository pattern with Drizzle ORM for data access (TechnologyRepository, ProjectRepository)
- Service layer with business logic (name uniqueness, slug generation, technologyIds validation)
- Test factory helpers for project and technology test data
- 90 unit tests covering validators, utilities, services, and routes

#### Phase 1 — Foundation
- Initial project setup (React/Vite, Hono, Tailwind CSS, ESLint, Prettier, Vitest)
- Project documentation (architecture, spec, changelog)
- CLAUDE.md configuration
- Drizzle ORM schema with 9 tables: user, session, account, verification (auth), project, technology, project_technology, project_link, project_video (domain)
- Initial D1 migration (`0000_outgoing_dormammu.sql`)
- Better Auth integration with Google OAuth provider, backed by D1
- Auth middleware with admin email restriction (`server/middleware/auth.ts`)
- Hono routes: `/api/health`, `/api/auth/*`, `/api/me`
- React auth client with `signIn`, `signOut`, `useSession` (`src/lib/auth-client.ts`)
- Shared Bindings and AppEnv types (`shared/types/env.ts`)
- Cloudflare adapter for Vite dev server (D1 bindings in local dev)
- `.env.example` template for environment variables
- GitHub Actions CI pipeline (lint, typecheck, tests)
- Preview D1 database for safe testing

### Fixed
- Better Auth now uses D1 instead of in-memory SQLite
- trustedOrigins is environment-aware (APP_URL env var for production)
