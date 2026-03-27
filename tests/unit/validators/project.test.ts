import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@shared/validators/project";

describe("createProjectSchema", () => {
  it("accepts valid input with all fields", () => {
    const result = createProjectSchema.safeParse({
      title: "My Project",
      slug: "my-project",
      description: "A detailed markdown description of the project.",
      shortDescription: "A short summary",
      status: "published",
      technologyIds: ["tech-1", "tech-2"],
      links: [
        { label: "GitHub", url: "https://github.com/user/repo", type: "repository" },
        { label: "Demo", url: "https://demo.example.com", type: "demo" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with only required fields", () => {
    const result = createProjectSchema.safeParse({
      title: "My Project",
      description: "A detailed markdown description of the project.",
      shortDescription: "A short summary",
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to draft", () => {
    const result = createProjectSchema.safeParse({
      title: "My Project",
      description: "Description here.",
      shortDescription: "Short",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("draft");
    }
  });

  it("rejects missing title", () => {
    const result = createProjectSchema.safeParse({
      description: "Description",
      shortDescription: "Short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const result = createProjectSchema.safeParse({
      title: "Title",
      shortDescription: "Short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing shortDescription", () => {
    const result = createProjectSchema.safeParse({
      title: "Title",
      description: "Description",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = createProjectSchema.safeParse({
      title: "Title",
      description: "Description",
      shortDescription: "Short",
      status: "archived",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug format", () => {
    const result = createProjectSchema.safeParse({
      title: "Title",
      description: "Description",
      shortDescription: "Short",
      slug: "Invalid Slug!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid slug format", () => {
    const result = createProjectSchema.safeParse({
      title: "Title",
      description: "Description",
      shortDescription: "Short",
      slug: "my-valid-slug-123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid link type", () => {
    const result = createProjectSchema.safeParse({
      title: "Title",
      description: "Description",
      shortDescription: "Short",
      links: [{ label: "Link", url: "https://example.com", type: "invalid" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProjectSchema", () => {
  it("accepts partial input", () => {
    const result = updateProjectSchema.safeParse({
      title: "Updated Title",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = updateProjectSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects invalid status when provided", () => {
    const result = updateProjectSchema.safeParse({ status: "archived" });
    expect(result.success).toBe(false);
  });
});
