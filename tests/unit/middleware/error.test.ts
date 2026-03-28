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

  app.get("/api/not-found", () => {
    throw new NotFoundError("Project not found");
  });

  app.get("/api/conflict", () => {
    throw new ConflictError("Name already exists");
  });

  app.get("/api/validation", () => {
    throw new ValidationError("Invalid input");
  });

  app.get("/api/app-error", () => {
    throw new AppError("Custom error", 422);
  });

  app.get("/api/unexpected", () => {
    throw new Error("Something broke");
  });

  app.get("/non-api-error", () => {
    throw new Error("Something broke");
  });

  app.onError(errorHandler);

  return app;
}

describe("Error Handler Middleware", () => {
  const app = createTestApp();

  it("handles NotFoundError with 404", async () => {
    const res = await app.request("/api/not-found");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Project not found" });
  });

  it("handles ConflictError with 409", async () => {
    const res = await app.request("/api/conflict");
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "Name already exists" });
  });

  it("handles ValidationError with 400", async () => {
    const res = await app.request("/api/validation");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid input" });
  });

  it("handles AppError with custom status code", async () => {
    const res = await app.request("/api/app-error");
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ error: "Custom error" });
  });

  it("handles unexpected errors with 500 JSON on API routes", async () => {
    const res = await app.request("/api/unexpected");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });
  });

  it("returns HTML for errors on non-API routes", async () => {
    const res = await app.request("/non-api-error");
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toContain("<html>");
    expect(text).not.toContain('"error"');
  });
});
