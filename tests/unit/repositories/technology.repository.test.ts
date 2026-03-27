import { describe, it, expect, vi, beforeEach } from "vitest";
import { TechnologyRepository } from "@server/repositories/technology.repository";

// Mock drizzle-orm/d1
vi.mock("drizzle-orm/d1", () => ({
  drizzle: vi.fn(),
}));

describe("TechnologyRepository", () => {
  let repo: TechnologyRepository;
  let mockDb: D1Database;

  beforeEach(() => {
    mockDb = {} as D1Database;
    repo = new TechnologyRepository(mockDb);
  });

  it("can be instantiated with a D1 database", () => {
    expect(repo).toBeInstanceOf(TechnologyRepository);
  });

  it("has findAll method", () => {
    expect(typeof repo.findAll).toBe("function");
  });

  it("has findById method", () => {
    expect(typeof repo.findById).toBe("function");
  });

  it("has findByName method", () => {
    expect(typeof repo.findByName).toBe("function");
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
});
