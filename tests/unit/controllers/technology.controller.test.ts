import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { createTechnologyRoutes } from "@server/routes/technology.routes";
import { ConflictError, NotFoundError } from "@server/errors";
import { errorHandler } from "@server/middleware/error";

const mockService = {
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

vi.mock("@server/services/technology.service", () => ({
  TechnologyService: vi.fn(),
}));

vi.mock("@server/repositories/technology.repository", () => ({
  TechnologyRepository: vi.fn(),
}));

vi.mock("@server/middleware/auth", () => ({
  requireAuth: vi.fn().mockImplementation(async (_c: unknown, next: () => Promise<void>) => {
    await next();
  }),
}));

function createTestApp() {
  const app = new Hono();
  app.route("/api/technologies", createTechnologyRoutes(mockService as never));
  app.onError(errorHandler);
  return app;
}

describe("Technology Routes", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe("GET /api/technologies", () => {
    it("returns all technologies", async () => {
      const techs = [
        { id: "1", name: "React", category: "Frontend", iconUrl: null },
      ];
      mockService.getAll.mockResolvedValue(techs);

      const res = await app.request("/api/technologies");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(techs);
    });
  });

  describe("POST /api/technologies", () => {
    it("creates a technology with valid data", async () => {
      const created = { id: "1", name: "React", category: "Frontend", iconUrl: null };
      mockService.create.mockResolvedValue(created);

      const res = await app.request("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "React", category: "Frontend" }),
      });

      expect(res.status).toBe(201);
      expect(await res.json()).toEqual(created);
    });

    it("returns 400 for invalid data", async () => {
      const res = await app.request("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
    });

    it("returns 409 when name conflicts", async () => {
      mockService.create.mockRejectedValue(new ConflictError("Already exists"));

      const res = await app.request("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "React" }),
      });

      expect(res.status).toBe(409);
    });
  });

  describe("PATCH /api/technologies/:id", () => {
    it("updates a technology", async () => {
      const updated = { id: "1", name: "Vue", category: "Frontend", iconUrl: null };
      mockService.update.mockResolvedValue(updated);

      const res = await app.request("/api/technologies/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Vue" }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(updated);
    });

    it("returns 404 when technology not found", async () => {
      mockService.update.mockRejectedValue(new NotFoundError("Not found"));

      const res = await app.request("/api/technologies/999", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Vue" }),
      });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/technologies/:id", () => {
    it("deletes a technology", async () => {
      mockService.remove.mockResolvedValue(undefined);

      const res = await app.request("/api/technologies/1", {
        method: "DELETE",
      });

      expect(res.status).toBe(204);
    });

    it("returns 404 when technology not found", async () => {
      mockService.remove.mockRejectedValue(new NotFoundError("Not found"));

      const res = await app.request("/api/technologies/999", {
        method: "DELETE",
      });

      expect(res.status).toBe(404);
    });
  });
});
