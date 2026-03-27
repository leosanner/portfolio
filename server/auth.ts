import { betterAuth } from "better-auth";
import type { Bindings } from "@shared/types/env";

export function createAuth(env: Bindings) {
  return betterAuth({
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    trustedOrigins: env.APP_URL
      ? [env.APP_URL]
      : ["http://localhost:5173"],
  });
}

export type Auth = ReturnType<typeof createAuth>;
