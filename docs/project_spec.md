# Project Specification

## Overview

**Name**: Portfolio
**Purpose**: A full-stack portfolio application focused on professional presentation, projects, and experience. The main differentiator is the ability to attach and display video explanations for each project.
**Target Users**: Visitors (potential employers, collaborators) viewing the portfolio; the portfolio owner as admin managing content.

## Functional Requirements

### Public Area

- **Homepage**: Landing page with professional presentation
- **About section**: Personal information and background
- **Stack/Technologies section**: Display technologies and tools used
- **Experience section**: Professional experience timeline
- **Projects list**: Browse all published projects with description, stack, and links
- **Project detail page**: Full project view with description, stack, links, repository link, and embedded video player
- **Video playback**: Stream-powered video player on project pages

### Authenticated/Admin Area

- **Google login**: OAuth-based authentication via Better Auth
- **Project CRUD**: Create, edit, and delete projects
- **Project links management**: Add/remove links per project (demo, repo, etc.)
- **Technology management**: Manage the technologies/stack catalog
- **Video upload**: Request upload URL, upload video directly to Stream
- **Video association**: Link uploaded videos to projects
- **Publication control**: Toggle project visibility (draft/published)

### Video Flow

1. Authenticated admin requests a video upload URL from the backend
2. Backend generates a secure, time-limited upload URL via Cloudflare Stream API
3. Client uploads the video directly to Cloudflare Stream
4. Backend stores video metadata (stream ID, upload status)
5. Project detail page renders the embedded Stream player

## Non-Functional Requirements

- **Performance**: Edge-deployed via Cloudflare Workers for low-latency globally
- **Security**: OAuth authentication, signed upload URLs, protected admin routes, no video passthrough via backend
- **Type safety**: End-to-end TypeScript with shared Zod validation schemas
- **Testability**: TDD approach, unit and integration tests with Vitest
- **Maintainability**: Layered architecture with low coupling between components

## API Routes

### Public

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/projects` | List published projects |
| GET | `/api/projects/:slug` | Get project by slug |

### Authenticated

| Method | Path | Description |
|---|---|---|
| GET | `/api/me` | Get current user info |
| POST | `/api/projects` | Create a new project |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| POST | `/api/projects/:id/video` | Request video upload URL |
| POST | `/api/technologies` | Create a technology |
| PATCH | `/api/technologies/:id` | Update a technology |
| DELETE | `/api/technologies/:id` | Delete a technology |

### Auth (managed by Better Auth)

| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/*` | Better Auth routes (login, callback, session, logout) |

## Data Models

### User
- `id`: string (primary key)
- `name`: string
- `email`: string (unique)
- `emailVerified`: boolean
- `image`: string (nullable)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Project
- `id`: string (primary key)
- `title`: string
- `slug`: string (unique)
- `description`: text
- `shortDescription`: string
- `status`: enum (draft, published)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Technology
- `id`: string (primary key)
- `name`: string (unique)
- `category`: string (nullable)
- `iconUrl`: string (nullable)

### ProjectTechnology (join table)
- `projectId`: string (foreign key)
- `technologyId`: string (foreign key)

### ProjectLink
- `id`: string (primary key)
- `projectId`: string (foreign key)
- `label`: string
- `url`: string
- `type`: enum (repository, demo, docs, other)

### ProjectVideo
- `id`: string (primary key)
- `projectId`: string (foreign key, unique)
- `streamId`: string (Cloudflare Stream video ID)
- `status`: enum (pending, ready, error)
- `createdAt`: timestamp

### Session (Better Auth)
- `id`: string (primary key)
- `expiresAt`: timestamp
- `token`: string (unique)
- `ipAddress`: string (nullable)
- `userAgent`: string (nullable)
- `userId`: string (foreign key -> User)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Account (Better Auth)
- `id`: string (primary key)
- `accountId`: string
- `providerId`: string
- `userId`: string (foreign key -> User)
- `accessToken`: string (nullable)
- `refreshToken`: string (nullable)
- `idToken`: string (nullable)
- `accessTokenExpiresAt`: timestamp (nullable)
- `refreshTokenExpiresAt`: timestamp (nullable)
- `scope`: string (nullable)
- `password`: string (nullable)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Verification (Better Auth)
- `id`: string (primary key)
- `identifier`: string
- `value`: string
- `expiresAt`: timestamp
- `createdAt`: timestamp (nullable)
- `updatedAt`: timestamp (nullable)

## Milestones

### Phase 1 — Foundation (DONE)
- ~~Project scaffolding (Vite + Hono + Wrangler)~~
- ~~D1 database setup with Drizzle schema and migrations~~
- ~~Better Auth integration with Google provider (D1-backed)~~
- ~~Basic route protection middleware~~
- ~~CI pipeline (lint, typecheck, tests via GitHub Actions)~~

### Phase 2 — Project CRUD
- Project entity with full CRUD
- Technology management
- Project links management
- Admin UI for content management

### Phase 3 — Video Integration
- Cloudflare Stream adapter
- Video upload flow (signed URL generation)
- Video metadata storage
- Embedded player on project detail page

### Phase 4 — Polish
- Public-facing UI design and implementation
- Comprehensive test coverage
- Performance optimization
- Production deployment pipeline
