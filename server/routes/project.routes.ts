import { Hono } from "hono";
import type { AppEnv } from "@shared/types/env";
import { ProjectRepository } from "../repositories/project.repository";
import { TechnologyRepository } from "../repositories/technology.repository";
import { ProjectService } from "../services/project.service";
import { createProjectSchema, updateProjectSchema } from "@shared/validators/project";
import { ValidationError } from "../errors";
import { requireAuth } from "../middleware/auth";

export function createProjectRoutes(serviceOverride?: ProjectService) {
  const routes = new Hono<AppEnv>();

  function getService(db?: D1Database) {
    if (serviceOverride) return serviceOverride;
    return new ProjectService(
      new ProjectRepository(db!),
      new TechnologyRepository(db!),
    );
  }

  routes.get("/", async (c) => {
    const service = getService(c.env?.DB);
    const projects = await service.listPublished();
    return c.json(projects);
  });

  routes.get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const service = getService(c.env?.DB);
    const project = await service.getBySlug(slug);
    return c.json(project);
  });

  routes.get("/admin/all", requireAuth, async (c) => {
    const service = getService(c.env?.DB);
    const projects = await service.listAll();
    return c.json(projects);
  });

  routes.get("/admin/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const service = getService(c.env?.DB);
    const project = await service.getById(id);
    return c.json(project);
  });

  routes.post("/", requireAuth, async (c) => {
    const body = await c.req.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid project data");
    }
    const service = getService(c.env?.DB);
    const project = await service.create(parsed.data);
    return c.json(project, 201);
  });

  routes.patch("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid project data");
    }
    const service = getService(c.env?.DB);
    const project = await service.update(id, parsed.data);
    return c.json(project);
  });

  routes.delete("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const service = getService(c.env?.DB);
    await service.remove(id);
    return c.body(null, 204);
  });

  return routes;
}
