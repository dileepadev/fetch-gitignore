import { describe, it, expect } from "vitest";
import { spawnSync } from "child_process";
import path from "path";

const CLI_PATH = path.resolve("dist/bin/index.js");

function runCli(args: string[]): {
  stdout: string;
  stderr: string;
  exitCode: number;
} {
  const result = spawnSync("node", [CLI_PATH, ...args], {
    encoding: "utf-8",
    timeout: 15000,
  });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    exitCode: result.status ?? 1,
  };
}

describe("CLI integration", () => {
  it("should show help with --help flag", () => {
    const { stdout, exitCode } = runCli(["--help"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("fetch-gitignore");
    expect(stdout).toContain("list");
    expect(stdout).toContain("add");
  });

  it("should show version with --version flag", () => {
    const { stdout, exitCode } = runCli(["--version"]);
    expect(exitCode).toBe(0);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("should show help for list subcommand", () => {
    const { stdout, exitCode } = runCli(["list", "--help"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("--no-cache");
  });

  it("should show help for add subcommand", () => {
    const { stdout, exitCode } = runCli(["add", "--help"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("--dir");
    expect(stdout).toContain("--append");
    expect(stdout).toContain("--force");
    expect(stdout).toContain("--no-cache");
  });

  it("should gracefully handle non-existent directory", () => {
    const { stdout, stderr, exitCode } = runCli([
      "add",
      "Node",
      "--dir",
      "/nonexistent/dir/xyz",
    ]);
    // Error is caught gracefully and logged via logError (to stderr)
    expect(exitCode).toBe(0);
    expect(stderr).toContain("Directory does not exist");
  });
});
