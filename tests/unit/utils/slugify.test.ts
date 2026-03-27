import { describe, it, expect } from "vitest";
import { slugify } from "@server/utils/slugify";

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("My Project")).toBe("my-project");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("hello! @world#")).toBe("hello-world");
  });

  it("collapses consecutive hyphens", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles accented characters", () => {
    expect(slugify("café résumé")).toBe("cafe-resume");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles numbers", () => {
    expect(slugify("Project 2024")).toBe("project-2024");
  });
});
