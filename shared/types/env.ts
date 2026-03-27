export type Bindings = {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  ADMIN_EMAIL: string;
  APP_URL?: string;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: {
    user: Record<string, unknown>;
    session: Record<string, unknown>;
  };
};
