import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { resolveDirectory, mergeTemplates } from "../src/utils.js";

describe("resolveDirectory", () => {
  it("should resolve an existing directory to its absolute path", () => {
    const tmpDir = fs.mkdtempSync(path.join("/tmp", "fg-test-"));
    try {
      const result = resolveDirectory(tmpDir);
      expect(result).toBe(path.resolve(tmpDir));
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });

  it("should throw if the directory does not exist", () => {
    expect(() => resolveDirectory("/nonexistent/path/abc123")).toThrow(
      "Directory does not exist",
    );
  });

  it("should resolve relative paths against cwd", () => {
    // "." always exists
    const result = resolveDirectory(".");
    expect(result).toBe(path.resolve("."));
  });
});

describe("mergeTemplates", () => {
  it("should merge a single template with header", () => {
    const result = mergeTemplates(["node_modules/"]);
    expect(result).toContain("# ===== Template 1 =====");
    expect(result).toContain("node_modules/");
  });

  it("should merge multiple templates with numbered headers", () => {
    const result = mergeTemplates(["node_modules/", "*.pyc\n__pycache__/"]);
    expect(result).toContain("# ===== Template 1 =====");
    expect(result).toContain("# ===== Template 2 =====");
    expect(result).toContain("node_modules/");
    expect(result).toContain("*.pyc");
  });

  it("should trim whitespace from each template", () => {
    const result = mergeTemplates(["  \nnode_modules/\n  "]);
    // The content should be trimmed
    expect(result).toContain("node_modules/");
    expect(result).not.toContain("  \nnode_modules/\n  ");
  });

  it("should return empty string for empty array", () => {
    const result = mergeTemplates([]);
    expect(result).toBe("");
  });

  it("should separate templates with blank lines", () => {
    const result = mergeTemplates(["a", "b"]);
    const parts = result.split("\n\n");
    expect(parts.length).toBeGreaterThanOrEqual(2);
  });
});
