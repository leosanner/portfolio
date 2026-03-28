import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../drizzle/schema";
import type { Bindings } from "@shared/types/env";

export function createAuth(env: Bindings, requestUrl?: string) {
  const baseURL = env.APP_URL || (requestUrl ? new URL(requestUrl).origin : "http://localhost:5173");
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    baseURL,
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    trustedOrigins: env.APP_URL
      ? [env.APP_URL]
      : Array.from({ length: 10 }, (_, i) => `http://localhost:${5173 + i}`),
  });
}

export type Auth = ReturnType<typeof createAuth>;
