import { z } from "zod";

export const createTechnologySchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  iconUrl: z.string().url().optional(),
});

export const updateTechnologySchema = createTechnologySchema.partial();

export type CreateTechnologyInput = z.infer<typeof createTechnologySchema>;
export type UpdateTechnologyInput = z.infer<typeof updateTechnologySchema>;
