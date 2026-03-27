import { describe, it, expect, vi, beforeEach } from "vitest";
import { TechnologyService } from "@server/services/technology.service";
import type { TechnologyRepository } from "@server/repositories/technology.repository";
import { ConflictError, NotFoundError } from "@server/errors";

function createMockRepo() {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  } as unknown as TechnologyRepository & {
    findAll: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByName: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
}

describe("TechnologyService", () => {
  let service: TechnologyService;
  let mockRepo: ReturnType<typeof createMockRepo>;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new TechnologyService(mockRepo);
  });

  describe("getAll", () => {
    it("returns all technologies", async () => {
      const techs = [{ id: "1", name: "React", category: "Frontend", iconUrl: null }];
      mockRepo.findAll.mockResolvedValue(techs);

      const result = await service.getAll();

      expect(result).toEqual(techs);
      expect(mockRepo.findAll).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates a technology with valid data", async () => {
      const input = { name: "React", category: "Frontend" };
      const created = { id: "1", name: "React", category: "Frontend", iconUrl: null };
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(mockRepo.findByName).toHaveBeenCalledWith("React");
      expect(mockRepo.create).toHaveBeenCalledWith(input);
    });

    it("throws ConflictError if name already exists", async () => {
      const input = { name: "React" };
      mockRepo.findByName.mockResolvedValue({ id: "1", name: "React" });

      await expect(service.create(input)).rejects.toThrow(ConflictError);
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("updates a technology", async () => {
      const updated = { id: "1", name: "Vue", category: "Frontend", iconUrl: null };
      mockRepo.findById.mockResolvedValue({ id: "1", name: "React" });
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.update.mockResolvedValue(updated);

      const result = await service.update("1", { name: "Vue" });

      expect(result).toEqual(updated);
    });

    it("throws NotFoundError if technology does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.update("999", { name: "Vue" })).rejects.toThrow(NotFoundError);
    });

    it("throws ConflictError if new name conflicts with another technology", async () => {
      mockRepo.findById.mockResolvedValue({ id: "1", name: "React" });
      mockRepo.findByName.mockResolvedValue({ id: "2", name: "Vue" });

      await expect(service.update("1", { name: "Vue" })).rejects.toThrow(ConflictError);
    });

    it("allows updating to same name (no conflict with self)", async () => {
      const existing = { id: "1", name: "React", category: "Frontend", iconUrl: null };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.findByName.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(existing);

      const result = await service.update("1", { name: "React" });

      expect(result).toEqual(existing);
    });
  });

  describe("remove", () => {
    it("removes a technology", async () => {
      mockRepo.findById.mockResolvedValue({ id: "1", name: "React" });

      await service.remove("1");

      expect(mockRepo.remove).toHaveBeenCalledWith("1");
    });

    it("throws NotFoundError if technology does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.remove("999")).rejects.toThrow(NotFoundError);
    });
  });
});
