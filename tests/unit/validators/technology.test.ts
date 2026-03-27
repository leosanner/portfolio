import { describe, it, expect } from "vitest";
import {
  createTechnologySchema,
  updateTechnologySchema,
} from "@shared/validators/technology";

describe("createTechnologySchema", () => {
  it("accepts valid input with all fields", () => {
    const result = createTechnologySchema.safeParse({
      name: "React",
      category: "Frontend",
      iconUrl: "https://example.com/react.svg",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with only required fields", () => {
    const result = createTechnologySchema.safeParse({
      name: "React",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createTechnologySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = createTechnologySchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});

describe("updateTechnologySchema", () => {
  it("accepts partial input", () => {
    const result = updateTechnologySchema.safeParse({
      name: "Vue",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = updateTechnologySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects empty name when provided", () => {
    const result = updateTechnologySchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});
