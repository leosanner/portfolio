import { Hono } from "hono";
import { createAuth } from "./auth";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/error";
import { createTechnologyRoutes } from "./routes/technology.routes";
import { createProjectRoutes } from "./routes/project.routes";
import type { AppEnv } from "@shared/types/env";

const app = new Hono<AppEnv>();

app.onError(errorHandler);

app.route("/api/technologies", createTechnologyRoutes());
app.route("/api/projects", createProjectRoutes());

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

app.all("/api/auth/*", async (c) => {
  const auth = createAuth(c.env, c.req.url);
  return auth.handler(c.req.raw);
});

app.get("/api/me", requireAuth, (c) => {
  return c.json({ user: c.get("user") });
});

app.get("*", async (c) => {
  try {
    return c.env.ASSETS.fetch(c.req.raw);
  } catch {
    return c.html(
      "<html><body><h1>Something went wrong</h1><p>Please try again later.</p></body></html>",
      500,
    );
  }
});

export { app };
export type AppType = typeof app;
