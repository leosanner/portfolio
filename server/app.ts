import { Hono } from "hono";
import { createAuth } from "./auth";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/error";
import { createTechnologyRoutes } from "./routes/technology.routes";
import type { AppEnv } from "@shared/types/env";

const app = new Hono<AppEnv>();

app.onError(errorHandler);

app.route("/api/technologies", createTechnologyRoutes());

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

app.all("/api/auth/*", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

app.get("/api/me", requireAuth, (c) => {
  return c.json({ user: c.get("user") });
});

export { app };
export type AppType = typeof app;
