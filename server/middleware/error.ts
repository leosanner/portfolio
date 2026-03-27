import type { ErrorHandler } from "hono";
import { AppError } from "../errors";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as 400);
  }

  return c.json({ error: "Internal server error" }, 500);
};
