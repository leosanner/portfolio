import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import {
  project,
  projectLink,
  projectTechnology,
  technology,
} from "../../drizzle/schema";
import { generateId } from "../utils/id";
import type { ProjectLinkInput } from "@shared/validators/project";

export class ProjectRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async findAllPublished() {
    const projects = await this.db
      .select()
      .from(project)
      .where(eq(project.status, "published"));

    return Promise.all(projects.map((p) => this.loadRelations(p)));
  }

  async findBySlug(slug: string) {
    const results = await this.db
      .select()
      .from(project)
      .where(eq(project.slug, slug));
    const p = results[0];
    if (!p) return null;
    return this.loadRelations(p);
  }

  async findById(id: string) {
    const results = await this.db
      .select()
      .from(project)
      .where(eq(project.id, id));
    const p = results[0];
    if (!p) return null;
    return this.loadRelations(p);
  }

  async findBySlugRaw(slug: string) {
    const results = await this.db
      .select()
      .from(project)
      .where(eq(project.slug, slug));
    return results[0] ?? null;
  }

  async create(data: {
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    status: "draft" | "published";
  }) {
    const id = generateId();
    const now = new Date();
    const values = {
      id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.insert(project).values(values);
    return { ...values, id };
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      description: string;
      shortDescription: string;
      status: "draft" | "published";
    }>,
  ) {
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.slug !== undefined) updates.slug = data.slug;
    if (data.description !== undefined) updates.description = data.description;
    if (data.shortDescription !== undefined)
      updates.shortDescription = data.shortDescription;
    if (data.status !== undefined) updates.status = data.status;

    await this.db.update(project).set(updates).where(eq(project.id, id));
    return this.findById(id);
  }

  async remove(id: string) {
    await this.db.delete(project).where(eq(project.id, id));
  }

  async setProjectTechnologies(projectId: string, technologyIds: string[]) {
    await this.db
      .delete(projectTechnology)
      .where(eq(projectTechnology.projectId, projectId));

    if (technologyIds.length > 0) {
      await this.db.insert(projectTechnology).values(
        technologyIds.map((technologyId) => ({
          projectId,
          technologyId,
        })),
      );
    }
  }

  async setProjectLinks(projectId: string, links: ProjectLinkInput[]) {
    await this.db
      .delete(projectLink)
      .where(eq(projectLink.projectId, projectId));

    if (links.length > 0) {
      await this.db.insert(projectLink).values(
        links.map((link) => ({
          id: generateId(),
          projectId,
          label: link.label,
          url: link.url,
          type: link.type,
        })),
      );
    }
  }

  private async loadRelations(p: typeof project.$inferSelect) {
    const techs = await this.db
      .select({ id: technology.id, name: technology.name, category: technology.category, iconUrl: technology.iconUrl })
      .from(projectTechnology)
      .innerJoin(technology, eq(projectTechnology.technologyId, technology.id))
      .where(eq(projectTechnology.projectId, p.id));

    const links = await this.db
      .select()
      .from(projectLink)
      .where(eq(projectLink.projectId, p.id));

    return { ...p, technologies: techs, links };
  }
}
