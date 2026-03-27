import { ProjectRepository } from "../repositories/project.repository";
import { TechnologyRepository } from "../repositories/technology.repository";
import { NotFoundError, ValidationError } from "../errors";
import { slugify } from "../utils/slugify";
import type { CreateProjectInput, UpdateProjectInput } from "@shared/validators/project";

export class ProjectService {
  constructor(
    private projectRepo: ProjectRepository,
    private techRepo: TechnologyRepository,
  ) {}

  async listPublished() {
    return this.projectRepo.findAllPublished();
  }

  async getBySlug(slug: string) {
    const project = await this.projectRepo.findBySlug(slug);
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    return project;
  }

  async create(input: CreateProjectInput) {
    const slug = await this.resolveSlug(input.slug ?? slugify(input.title));

    if (input.technologyIds?.length) {
      await this.validateTechnologyIds(input.technologyIds);
    }

    const created = await this.projectRepo.create({
      title: input.title,
      slug,
      description: input.description,
      shortDescription: input.shortDescription,
      status: input.status ?? "draft",
    });

    if (input.technologyIds?.length) {
      await this.projectRepo.setProjectTechnologies(created.id, input.technologyIds);
    }

    if (input.links?.length) {
      await this.projectRepo.setProjectLinks(created.id, input.links);
    }

    return this.projectRepo.findById(created.id);
  }

  async update(id: string, input: UpdateProjectInput) {
    const existing = await this.projectRepo.findById(id);
    if (!existing) {
      throw new NotFoundError("Project not found");
    }

    if (input.technologyIds) {
      await this.validateTechnologyIds(input.technologyIds);
      await this.projectRepo.setProjectTechnologies(id, input.technologyIds);
    }

    if (input.links) {
      await this.projectRepo.setProjectLinks(id, input.links);
    }

    const { technologyIds, links, ...projectFields } = input;
    if (Object.keys(projectFields).length > 0) {
      await this.projectRepo.update(id, projectFields);
    }

    return this.projectRepo.findById(id);
  }

  async remove(id: string) {
    const existing = await this.projectRepo.findById(id);
    if (!existing) {
      throw new NotFoundError("Project not found");
    }
    await this.projectRepo.remove(id);
  }

  private async resolveSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;

    while (await this.projectRepo.findBySlugRaw(slug)) {
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }

    return slug;
  }

  private async validateTechnologyIds(ids: string[]) {
    for (const id of ids) {
      const tech = await this.techRepo.findById(id);
      if (!tech) {
        throw new ValidationError(`Technology "${id}" not found`);
      }
    }
  }
}
