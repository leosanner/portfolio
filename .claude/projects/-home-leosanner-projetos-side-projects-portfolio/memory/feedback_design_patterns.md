---
name: Use classes for design patterns
description: User wants classes (not functions) for repositories and services to match documented architecture patterns
type: feedback
---

Use classes for repositories and services, not plain functions. Constructor injection for dependencies.

**Why:** User questioned the functions-over-classes decision — the architecture docs specify Repository Pattern and Service Layer which conventionally use classes. User wants to follow the documented patterns.

**How to apply:** Repositories accept D1Database in constructor, services accept repository instances in constructor. This enables clean DI and testability with mocks.
