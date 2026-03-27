import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import {
  AppError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from "@server/errors";
import { errorHandler } from "@server/middleware/error";

function createTestApp() {
  const app = new Hono();

  app.get("/not-found", () => {
    throw new NotFoundError("Project not found");
  });

  app.get("/conflict", () => {
    throw new ConflictError("Name already exists");
  });

  app.get("/validation", () => {
    throw new ValidationError("Invalid input");
  });

  app.get("/app-error", () => {
    throw new AppError("Custom error", 422);
  });

  app.get("/unexpected", () => {
    throw new Error("Something broke");
  });

  app.onError(errorHandler);

  return app;
}

describe("Error Handler Middleware", () => {
  const app = createTestApp();

  it("handles NotFoundError with 404", async () => {
    const res = await app.request("/not-found");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Project not found" });
  });

  it("handles ConflictError with 409", async () => {
    const res = await app.request("/conflict");
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "Name already exists" });
  });

  it("handles ValidationError with 400", async () => {
    const res = await app.request("/validation");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid input" });
  });

  it("handles AppError with custom status code", async () => {
    const res = await app.request("/app-error");
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ error: "Custom error" });
  });

  it("handles unexpected errors with 500", async () => {
    const res = await app.request("/unexpected");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });
  });
});
