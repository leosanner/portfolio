import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

export { app };
export type AppType = typeof app;
