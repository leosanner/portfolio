import { Hono } from "hono";
import type { AppEnv } from "@shared/types/env";
import { TechnologyRepository } from "../repositories/technology.repository";
import { TechnologyService } from "../services/technology.service";
import { createTechnologySchema, updateTechnologySchema } from "@shared/validators/technology";
import { ValidationError } from "../errors";
import { requireAuth } from "../middleware/auth";

export function createTechnologyRoutes(serviceOverride?: TechnologyService) {
  const routes = new Hono<AppEnv>();

  function getService(db?: D1Database) {
    if (serviceOverride) return serviceOverride;
    return new TechnologyService(new TechnologyRepository(db!));
  }

  routes.get("/", async (c) => {
    const service = getService(c.env?.DB);
    const technologies = await service.getAll();
    return c.json(technologies);
  });

  routes.post("/", requireAuth, async (c) => {
    const body = await c.req.json();
    const parsed = createTechnologySchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid technology data");
    }
    const service = getService(c.env?.DB);
    const technology = await service.create(parsed.data);
    return c.json(technology, 201);
  });

  routes.patch("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = updateTechnologySchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid technology data");
    }
    const service = getService(c.env?.DB);
    const technology = await service.update(id, parsed.data);
    return c.json(technology);
  });

  routes.delete("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const service = getService(c.env?.DB);
    await service.remove(id);
    return c.body(null, 204);
  });

  return routes;
}
