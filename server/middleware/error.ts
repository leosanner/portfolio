import type { ErrorHandler } from "hono";
import { AppError } from "../errors";

export const errorHandler: ErrorHandler = (err, c) => {
  if (!c.req.path.startsWith("/api/")) {
    return c.html(
      "<html><body><h1>Something went wrong</h1></body></html>",
      500,
    );
  }

  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as 400);
  }

  return c.json({ error: "Internal server error" }, 500);
};
