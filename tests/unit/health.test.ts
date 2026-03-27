import { describe, it, expect } from "vitest";
import { app } from "@server/app";

describe("GET /api/health", () => {
  it("returns status ok", async () => {
    const res = await app.request("/api/health");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
