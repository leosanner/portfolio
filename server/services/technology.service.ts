import { TechnologyRepository } from "../repositories/technology.repository";
import { ConflictError, NotFoundError } from "../errors";
import type { CreateTechnologyInput, UpdateTechnologyInput } from "@shared/validators/technology";

export class TechnologyService {
  private repo: TechnologyRepository;

  constructor(repo: TechnologyRepository) {
    this.repo = repo;
  }

  async getAll() {
    return this.repo.findAll();
  }

  async create(input: CreateTechnologyInput) {
    const existing = await this.repo.findByName(input.name);
    if (existing) {
      throw new ConflictError(`Technology "${input.name}" already exists`);
    }
    return this.repo.create(input);
  }

  async update(id: string, input: UpdateTechnologyInput) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError("Technology not found");
    }

    if (input.name) {
      const nameConflict = await this.repo.findByName(input.name);
      if (nameConflict && nameConflict.id !== id) {
        throw new ConflictError(`Technology "${input.name}" already exists`);
      }
    }

    return this.repo.update(id, input);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError("Technology not found");
    }
    await this.repo.remove(id);
  }
}
