import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectService } from "@server/services/project.service";
import type { ProjectRepository } from "@server/repositories/project.repository";
import type { TechnologyRepository } from "@server/repositories/technology.repository";
import { NotFoundError, ValidationError } from "@server/errors";

function createMockProjectRepo() {
  return {
    findAllPublished: vi.fn(),
    findBySlug: vi.fn(),
    findBySlugRaw: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    setProjectTechnologies: vi.fn(),
    setProjectLinks: vi.fn(),
  } as unknown as ProjectRepository & Record<string, ReturnType<typeof vi.fn>>;
}

function createMockTechRepo() {
  return {
    findById: vi.fn(),
    findAll: vi.fn(),
    findByName: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  } as unknown as TechnologyRepository & Record<string, ReturnType<typeof vi.fn>>;
}

describe("ProjectService", () => {
  let service: ProjectService;
  let projectRepo: ReturnType<typeof createMockProjectRepo>;
  let techRepo: ReturnType<typeof createMockTechRepo>;

  beforeEach(() => {
    projectRepo = createMockProjectRepo();
    techRepo = createMockTechRepo();
    service = new ProjectService(projectRepo, techRepo);
  });

  describe("listPublished", () => {
    it("returns all published projects", async () => {
      const projects = [{ id: "1", title: "Test", status: "published" }];
      projectRepo.findAllPublished.mockResolvedValue(projects);

      const result = await service.listPublished();

      expect(result).toEqual(projects);
    });
  });

  describe("getBySlug", () => {
    it("returns project by slug", async () => {
      const proj = { id: "1", title: "Test", slug: "test" };
      projectRepo.findBySlug.mockResolvedValue(proj);

      const result = await service.getBySlug("test");

      expect(result).toEqual(proj);
    });

    it("throws NotFoundError if project not found", async () => {
      projectRepo.findBySlug.mockResolvedValue(null);

      await expect(service.getBySlug("nonexistent")).rejects.toThrow(NotFoundError);
    });
  });

  describe("create", () => {
    it("creates a project with auto-generated slug", async () => {
      const input = {
        title: "My Cool Project",
        description: "Description",
        shortDescription: "Short",
      };
      const created = { id: "1", ...input, slug: "my-cool-project", status: "draft" };
      projectRepo.findBySlugRaw.mockResolvedValue(null);
      projectRepo.create.mockResolvedValue(created);
      projectRepo.findById.mockResolvedValue({ ...created, technologies: [], links: [] });

      const result = await service.create(input);

      expect(projectRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "my-cool-project" }),
      );
      expect(result).toBeDefined();
    });

    it("uses provided slug when given", async () => {
      const input = {
        title: "My Project",
        slug: "custom-slug",
        description: "Description",
        shortDescription: "Short",
      };
      projectRepo.findBySlugRaw.mockResolvedValue(null);
      projectRepo.create.mockResolvedValue({ id: "1", ...input, status: "draft" });
      projectRepo.findById.mockResolvedValue({ id: "1", ...input, status: "draft", technologies: [], links: [] });

      await service.create(input);

      expect(projectRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "custom-slug" }),
      );
    });

    it("appends numeric suffix on slug collision", async () => {
      const input = {
        title: "My Project",
        description: "Description",
        shortDescription: "Short",
      };
      projectRepo.findBySlugRaw
        .mockResolvedValueOnce({ id: "existing" })  // "my-project" taken
        .mockResolvedValueOnce(null);                // "my-project-1" available
      projectRepo.create.mockResolvedValue({ id: "1", slug: "my-project-1" });
      projectRepo.findById.mockResolvedValue({ id: "1", slug: "my-project-1", technologies: [], links: [] });

      await service.create(input);

      expect(projectRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "my-project-1" }),
      );
    });

    it("validates technologyIds exist", async () => {
      const input = {
        title: "My Project",
        description: "Description",
        shortDescription: "Short",
        technologyIds: ["tech-1", "tech-2"],
      };
      projectRepo.findBySlugRaw.mockResolvedValue(null);
      techRepo.findById
        .mockResolvedValueOnce({ id: "tech-1" })
        .mockResolvedValueOnce(null);  // tech-2 doesn't exist

      await expect(service.create(input)).rejects.toThrow(ValidationError);
    });

    it("sets technologies and links after creation", async () => {
      const input = {
        title: "My Project",
        description: "Description",
        shortDescription: "Short",
        technologyIds: ["tech-1"],
        links: [{ label: "GitHub", url: "https://github.com/test", type: "repository" as const }],
      };
      projectRepo.findBySlugRaw.mockResolvedValue(null);
      techRepo.findById.mockResolvedValue({ id: "tech-1" });
      projectRepo.create.mockResolvedValue({ id: "proj-1" });
      projectRepo.findById.mockResolvedValue({ id: "proj-1", technologies: [], links: [] });

      await service.create(input);

      expect(projectRepo.setProjectTechnologies).toHaveBeenCalledWith("proj-1", ["tech-1"]);
      expect(projectRepo.setProjectLinks).toHaveBeenCalledWith("proj-1", input.links);
    });
  });

  describe("update", () => {
    it("throws NotFoundError if project not found", async () => {
      projectRepo.findById.mockResolvedValue(null);

      await expect(service.update("999", { title: "New" })).rejects.toThrow(NotFoundError);
    });

    it("updates project fields", async () => {
      const existing = { id: "1", title: "Old", slug: "old" };
      const updated = { ...existing, title: "New" };
      projectRepo.findById
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(updated);
      projectRepo.update.mockResolvedValue(updated);

      const result = await service.update("1", { title: "New" });

      expect(projectRepo.update).toHaveBeenCalledWith("1", { title: "New" });
      expect(result).toEqual(updated);
    });

    it("replaces technologies when provided", async () => {
      const existing = { id: "1", title: "Test" };
      projectRepo.findById
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(existing);
      projectRepo.update.mockResolvedValue(existing);
      techRepo.findById.mockResolvedValue({ id: "tech-1" });

      await service.update("1", { technologyIds: ["tech-1"] });

      expect(projectRepo.setProjectTechnologies).toHaveBeenCalledWith("1", ["tech-1"]);
    });

    it("replaces links when provided", async () => {
      const existing = { id: "1", title: "Test" };
      const links = [{ label: "Demo", url: "https://demo.com", type: "demo" as const }];
      projectRepo.findById
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(existing);
      projectRepo.update.mockResolvedValue(existing);

      await service.update("1", { links });

      expect(projectRepo.setProjectLinks).toHaveBeenCalledWith("1", links);
    });
  });

  describe("remove", () => {
    it("removes a project", async () => {
      projectRepo.findById.mockResolvedValue({ id: "1" });

      await service.remove("1");

      expect(projectRepo.remove).toHaveBeenCalledWith("1");
    });

    it("throws NotFoundError if project not found", async () => {
      projectRepo.findById.mockResolvedValue(null);

      await expect(service.remove("999")).rejects.toThrow(NotFoundError);
    });
  });
});
