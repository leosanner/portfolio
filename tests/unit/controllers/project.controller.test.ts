import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { createProjectRoutes } from "@server/routes/project.routes";
import { NotFoundError } from "@server/errors";
import { errorHandler } from "@server/middleware/error";

const mockService = {
  listAll: vi.fn(),
  listPublished: vi.fn(),
  getById: vi.fn(),
  getBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

vi.mock("@server/middleware/auth", () => ({
  requireAuth: vi.fn().mockImplementation(async (_c: unknown, next: () => Promise<void>) => {
    await next();
  }),
}));

vi.mock("@server/services/project.service", () => ({
  ProjectService: vi.fn(),
}));

vi.mock("@server/repositories/project.repository", () => ({
  ProjectRepository: vi.fn(),
}));

vi.mock("@server/repositories/technology.repository", () => ({
  TechnologyRepository: vi.fn(),
}));

function createTestApp() {
  const app = new Hono();
  app.route("/api/projects", createProjectRoutes(mockService as never));
  app.onError(errorHandler);
  return app;
}

describe("Project Routes", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe("GET /api/projects", () => {
    it("returns published projects", async () => {
      const projects = [
        { id: "1", title: "Test", slug: "test", status: "published", technologies: [], links: [] },
      ];
      mockService.listPublished.mockResolvedValue(projects);

      const res = await app.request("/api/projects");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(projects);
    });
  });

  describe("GET /api/projects/:slug", () => {
    it("returns project by slug", async () => {
      const project = { id: "1", title: "Test", slug: "test", technologies: [], links: [] };
      mockService.getBySlug.mockResolvedValue(project);

      const res = await app.request("/api/projects/test");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(project);
    });

    it("returns 404 when project not found", async () => {
      mockService.getBySlug.mockRejectedValue(new NotFoundError("Not found"));

      const res = await app.request("/api/projects/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/projects/admin/all", () => {
    it("returns all projects including drafts", async () => {
      const projects = [
        { id: "1", title: "Published", status: "published" },
        { id: "2", title: "Draft", status: "draft" },
      ];
      mockService.listAll.mockResolvedValue(projects);

      const res = await app.request("/api/projects/admin/all");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(projects);
    });
  });

  describe("GET /api/projects/admin/:id", () => {
    it("returns project by id", async () => {
      const project = { id: "1", title: "Test" };
      mockService.getById.mockResolvedValue(project);

      const res = await app.request("/api/projects/admin/1");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(project);
    });

    it("returns 404 when project not found", async () => {
      mockService.getById.mockRejectedValue(new NotFoundError("Not found"));

      const res = await app.request("/api/projects/admin/999");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/projects", () => {
    it("creates a project with valid data", async () => {
      const created = { id: "1", title: "New Project", slug: "new-project" };
      mockService.create.mockResolvedValue(created);

      const res = await app.request("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Project",
          description: "A description",
          shortDescription: "Short",
        }),
      });

      expect(res.status).toBe(201);
      expect(await res.json()).toEqual(created);
    });

    it("returns 400 for invalid data", async () => {
      const res = await app.request("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "" }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/projects/:id", () => {
    it("updates a project", async () => {
      const updated = { id: "1", title: "Updated" };
      mockService.update.mockResolvedValue(updated);

      const res = await app.request("/api/projects/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated" }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(updated);
    });

    it("returns 404 when project not found", async () => {
      mockService.update.mockRejectedValue(new NotFoundError("Not found"));

      const res = await app.request("/api/projects/999", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated" }),
      });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/projects/:id", () => {
    it("deletes a project", async () => {
      mockService.remove.mockResolvedValue(undefined);

      const res = await app.request("/api/projects/1", {
        method: "DELETE",
      });

      expect(res.status).toBe(204);
    });

    it("returns 404 when project not found", async () => {
      mockService.remove.mockRejectedValue(new NotFoundError("Not found"));

      const res = await app.request("/api/projects/999", {
        method: "DELETE",
      });

      expect(res.status).toBe(404);
    });
  });
});
