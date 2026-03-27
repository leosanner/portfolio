import { createMiddleware } from "hono/factory";
import { createAuth } from "../auth";
import type { AppEnv } from "@shared/types/env";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (c.env.ADMIN_EMAIL && session.user.email !== c.env.ADMIN_EMAIL) {
    return c.json({ error: "Forbidden" }, 403);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
