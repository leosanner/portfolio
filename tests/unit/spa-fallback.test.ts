import { describe, it, expect, vi } from "vitest";
import { app } from "@server/app";

function createMockAssets(body: string) {
  return {
    fetch: vi.fn(() => new Response(body, { status: 200 })),
  };
}

describe("SPA fallback", () => {
  it("delegates non-API GET requests to ASSETS", async () => {
    const mockAssets = createMockAssets("<html>SPA</html>");

    const res = await app.request("/admin", {}, { ASSETS: mockAssets });

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("<html>SPA</html>");
    expect(mockAssets.fetch).toHaveBeenCalled();
  });

  it("delegates nested SPA routes to ASSETS", async () => {
    const mockAssets = createMockAssets("<html>SPA</html>");

    const res = await app.request(
      "/admin/projects/new",
      {},
      { ASSETS: mockAssets },
    );

    expect(res.status).toBe(200);
    expect(mockAssets.fetch).toHaveBeenCalled();
  });

  it("does not affect API routes", async () => {
    const res = await app.request("/api/health");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
