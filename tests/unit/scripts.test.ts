import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("package.json scripts", () => {
  const pkg = JSON.parse(
    readFileSync(resolve(__dirname, "../../package.json"), "utf-8"),
  );

  it("has db:migrate:prod script that targets remote D1", () => {
    expect(pkg.scripts["db:migrate:prod"]).toBe(
      "wrangler d1 migrations apply portfolio-db --remote",
    );
  });

  it("has db:migrate script that targets local D1", () => {
    expect(pkg.scripts["db:migrate"]).toBe(
      "wrangler d1 migrations apply portfolio-db --local",
    );
  });
});
