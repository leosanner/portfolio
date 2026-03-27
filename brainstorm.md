# Brainstorm — Full-Stack Portfolio with React/Vite + Hono + Cloudflare Workers

## 1. Project Overview

Build a full-stack portfolio focused on professional presentation, projects, and experience, where the main differentiator is the ability to attach and display videos explaining each project.

The product should balance:

* strong visual experience
* simple but solid architecture
* Google authentication
* secure video upload flow
* modern TypeScript stack
* deployment aligned with the Cloudflare ecosystem

---

## 2. Main Objective

Create a single application, within a single repository, with:

* **Front-end** using React + Vite
* **Back-end/BFF** using Hono
* **Deployment** on Cloudflare Workers
* **Videos** hosted and delivered via Cloudflare Stream
* **Authentication** with Better Auth + Google Provider
* **Relational database** for authentication and domain data

The idea is for React to handle the UI layer, while Hono handles:

* authentication
* business logic
* Cloudflare Stream integration
* internal endpoints
* route protection
* upload orchestration and project management

---

## 3. Initial Functional Scope

### 3.1 Public Area

* portfolio homepage
* about section
* stack and technologies section
* experience section
* projects section
* project visualization with description, stack, links, and video
* repository link
* project detail page

### 3.2 Authenticated/Admin Area

* login with Google
* create, edit, and delete projects
* manage project links
* manage technologies/stack
* video upload generation
* associate video with project
* project visibility/publication control

### 3.3 Video Flow

* authenticated user requests video upload
* backend generates secure upload URL
* client uploads video directly to video service
* backend stores video metadata
* project displays the associated video player

---

## 4. Proposed Stack

### 4.1 Front-end

* React
* Vite
* TypeScript
* React Router (or simple SPA routing)
* Tailwind CSS
* shadcn/ui
* Zod for shared validation

### 4.2 Back-end / BFF

* Hono
* TypeScript
* Cloudflare Workers runtime
* layered separation to avoid tight coupling

### 4.3 Authentication

* Better Auth
* Google as initial provider
* database-persisted sessions
* protected backend routes
* future RBAC possibility

### 4.4 Database

#### Main Recommendation

* Cloudflare D1
* Drizzle ORM
* Drizzle Kit
* D1 SQL migrations as source of truth

#### Environment Strategy

* local
* preview
* staging
* production

#### Key Rule

No Docker for local DB. Use D1 via Wrangler/Miniflare. Always reset and reapply migrations in dev.

### 4.5 Video

* Cloudflare Stream
* embedded player
* backend handles upload authorization

### 4.6 Quality and DX

* Mandatory TDD
* Vitest
* Testing Library
* ESLint
* Prettier
* GitHub Actions
* Wrangler/Miniflare

---

## 5. Architectural Choices

### 5.1 Macro Architecture

Simple monorepo with front and back together.

### 5.2 Style

Simplified MVC + Service Layer.

### 5.3 Patterns

* Repository Pattern
* Service Layer
* Factory/Builder
* DTOs
* Adapter

---

## 6. Domain Model

### Main Entities

* User
* Project
* Technology
* ProjectTechnology
* ProjectLink
* ProjectVideo
* Auth tables

---

## 7. Core Flows

### Login

OAuth via Google → session created → access admin

### Project Creation

validate → persist → enrich with links/stack/video

### Video Upload

secure upload → direct client upload → metadata stored

### Publishing

draft → publish → public visibility

---

## 8. Folder Structure (Summary)

* src/ → frontend
* worker/ → entrypoint
* server/ → backend layers
* drizzle/ → migrations
* scripts/ → dev tooling
* tests/ → testing

---

## 9. Backend Organization

* routes
* controllers
* services
* repositories
* integrations
* validators

---

## 10. Authentication Strategy

* Google-only MVP
* backend-controlled authorization
* simple admin role

---

## 11. Video Strategy

Frontend → select/upload
Backend → authorize/store metadata
Service → process/deliver

Rule: video must NOT pass through backend.

---

## 12. Local Development & DB

* D1 local via Wrangler
* reset DB + run migrations on dev start
* isolated DB for tests

---

## 13. Migrations

* versioned
* explicit
* consistent across environments

---

## 14. Testing

* TDD mandatory
* unit + integration
* E2E optional initially

---

## 15. CI/CD

### CI

* lint
  n* typecheck
* tests

### CD

* PR → preview
* main → production

---

## 16. Environment Variables

Examples:

* BETTER_AUTH_SECRET
* GOOGLE_CLIENT_ID
* CLOUDFLARE_API_TOKEN
* STREAM_TOKEN

---

## 17. Initial Routes

### Public

* GET /api/health
* GET /api/projects
* GET /api/projects/:slug

### Authenticated

* GET /api/me
* POST /api/projects
* PATCH /api/projects/:id

---

## 18. Technical Priorities

* simplicity
* clarity
* strong typing
* low coupling

Avoid premature complexity.

---

## 19. Roadmap

### Phase 1

* setup + auth + DB

### Phase 2

* project CRUD

### Phase 3

* video integration

### Phase 4

* testing + refinement

---

## 20. Final Recommendation

Stack:

* React + Vite
* Hono
* Cloudflare Workers
* Better Auth + Google
* D1 + Drizzle
* Cloudflare Stream
* GitHub Actions

Principle:

Start simple, test-first, evolve safely.

---

## 21. Next Artifacts

* architecture.md
* stack.md
* roadmap.md
* env.md
* database.md
* api-spec.md
* testing-strategy.md
* ci-cd.md
* coding-guidelines.md
* initial-tasks.md

