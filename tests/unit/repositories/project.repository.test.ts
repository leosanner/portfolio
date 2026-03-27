import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectRepository } from "@server/repositories/project.repository";

vi.mock("drizzle-orm/d1", () => ({
  drizzle: vi.fn(),
}));

describe("ProjectRepository", () => {
  let repo: ProjectRepository;

  beforeEach(() => {
    repo = new ProjectRepository({} as D1Database);
  });

  it("can be instantiated with a D1 database", () => {
    expect(repo).toBeInstanceOf(ProjectRepository);
  });

  it("has findAllPublished method", () => {
    expect(typeof repo.findAllPublished).toBe("function");
  });

  it("has findBySlug method", () => {
    expect(typeof repo.findBySlug).toBe("function");
  });

  it("has findById method", () => {
    expect(typeof repo.findById).toBe("function");
  });

  it("has create method", () => {
    expect(typeof repo.create).toBe("function");
  });

  it("has update method", () => {
    expect(typeof repo.update).toBe("function");
  });

  it("has remove method", () => {
    expect(typeof repo.remove).toBe("function");
  });

  it("has setProjectTechnologies method", () => {
    expect(typeof repo.setProjectTechnologies).toBe("function");
  });

  it("has setProjectLinks method", () => {
    expect(typeof repo.setProjectLinks).toBe("function");
  });
});
