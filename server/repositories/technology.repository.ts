import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { technology } from "../../drizzle/schema";
import { generateId } from "../utils/id";
import type { CreateTechnologyInput, UpdateTechnologyInput } from "@shared/validators/technology";

export class TechnologyRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async findAll() {
    return this.db.select().from(technology).all();
  }

  async findById(id: string) {
    const results = await this.db
      .select()
      .from(technology)
      .where(eq(technology.id, id));
    return results[0] ?? null;
  }

  async findByName(name: string) {
    const results = await this.db
      .select()
      .from(technology)
      .where(eq(technology.name, name));
    return results[0] ?? null;
  }

  async create(data: CreateTechnologyInput) {
    const id = generateId();
    const values = {
      id,
      name: data.name,
      category: data.category ?? null,
      iconUrl: data.iconUrl ?? null,
    };
    await this.db.insert(technology).values(values);
    return { ...values };
  }

  async update(id: string, data: UpdateTechnologyInput) {
    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.category !== undefined) updates.category = data.category;
    if (data.iconUrl !== undefined) updates.iconUrl = data.iconUrl;

    if (Object.keys(updates).length > 0) {
      await this.db.update(technology).set(updates).where(eq(technology.id, id));
    }

    return this.findById(id);
  }

  async remove(id: string) {
    await this.db.delete(technology).where(eq(technology.id, id));
  }
}
