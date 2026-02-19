import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { writeGitignore } from "../src/fileManager.js";

describe("writeGitignore", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join("/tmp", "fg-fm-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should create a new .gitignore file", () => {
    writeGitignore("node_modules/", tmpDir);
    const content = fs.readFileSync(path.join(tmpDir, ".gitignore"), "utf-8");
    expect(content).toBe("node_modules/");
  });

  it("should throw if .gitignore already exists without --append or --force", () => {
    fs.writeFileSync(path.join(tmpDir, ".gitignore"), "existing");
    expect(() => writeGitignore("new content", tmpDir)).toThrow(
      ".gitignore already exists",
    );
  });

  it("should overwrite existing .gitignore with --force", () => {
    fs.writeFileSync(path.join(tmpDir, ".gitignore"), "old content");
    writeGitignore("new content", tmpDir, { force: true });
    const content = fs.readFileSync(path.join(tmpDir, ".gitignore"), "utf-8");
    expect(content).toBe("new content");
  });

  it("should append to existing .gitignore with --append", () => {
    fs.writeFileSync(path.join(tmpDir, ".gitignore"), "old content");
    writeGitignore("appended content", tmpDir, { append: true });
    const content = fs.readFileSync(path.join(tmpDir, ".gitignore"), "utf-8");
    expect(content).toContain("old content");
    expect(content).toContain("appended content");
  });

  it("should create file with --append when .gitignore does not exist", () => {
    writeGitignore("new content", tmpDir, { append: true });
    const content = fs.readFileSync(path.join(tmpDir, ".gitignore"), "utf-8");
    expect(content).toBe("new content");
  });

  it("should create file with --force when .gitignore does not exist", () => {
    writeGitignore("content", tmpDir, { force: true });
    const content = fs.readFileSync(path.join(tmpDir, ".gitignore"), "utf-8");
    expect(content).toBe("content");
  });

  it("should use default options when none provided", () => {
    writeGitignore("content", tmpDir);
    expect(fs.existsSync(path.join(tmpDir, ".gitignore"))).toBe(true);
  });

  it("should prepend a newline when appending to existing file", () => {
    fs.writeFileSync(path.join(tmpDir, ".gitignore"), "line1");
    writeGitignore("line2", tmpDir, { append: true });
    const content = fs.readFileSync(path.join(tmpDir, ".gitignore"), "utf-8");
    expect(content).toBe("line1\nline2");
  });
});
