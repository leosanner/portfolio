import type { CreateTechnologyInput } from "@shared/validators/technology";
import type { CreateProjectInput } from "@shared/validators/project";

let counter = 0;

export function buildTechnology(
  overrides: Partial<CreateTechnologyInput> = {},
): CreateTechnologyInput {
  counter++;
  return {
    name: `Technology ${counter}`,
    category: "Frontend",
    ...overrides,
  };
}

export function buildProject(
  overrides: Partial<CreateProjectInput> = {},
): CreateProjectInput {
  counter++;
  return {
    title: `Project ${counter}`,
    description: `Description for project ${counter}`,
    shortDescription: `Short description ${counter}`,
    ...overrides,
  };
}

export function resetFactoryCounter() {
  counter = 0;
}
