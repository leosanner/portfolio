import { z } from "zod";

const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["repository", "demo", "docs", "other"]),
});

export const createProjectSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  status: z.enum(["draft", "published"]).default("draft"),
  technologyIds: z.array(z.string()).optional(),
  links: z.array(projectLinkSchema).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectLinkInput = z.infer<typeof projectLinkSchema>;
