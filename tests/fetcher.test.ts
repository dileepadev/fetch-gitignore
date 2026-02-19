import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchTemplate, listTemplates } from "../src/fetcher.js";

// Mock node-fetch
vi.mock("node-fetch", () => {
  const mockFetch = vi.fn();
  return { default: mockFetch };
});

import fetch from "node-fetch";
const mockFetch = vi.mocked(fetch);

function createMockResponse(options: {
  ok?: boolean;
  status?: number;
  body?: string;
  json?: unknown;
  headers?: Record<string, string>;
}) {
  const { ok = true, status = 200, body = "", json, headers = {} } = options;
  return {
    ok,
    status,
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
    text: vi.fn().mockResolvedValue(body),
    json: vi.fn().mockResolvedValue(json),
  } as unknown as ReturnType<typeof fetch> extends Promise<infer R>
    ? R
    : never;
}

describe("fetchTemplate", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return template content for a valid template name", async () => {
    const templateContent = "node_modules/\n.env\n";
    mockFetch.mockResolvedValue(
      createMockResponse({ body: templateContent }) as any,
    );

    const result = await fetchTemplate("Node");
    expect(result).toBe(templateContent);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore",
    );
  });

  it("should throw when template is not found (404)", async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({ ok: false, status: 404 }) as any,
    );

    await expect(fetchTemplate("NonExistent")).rejects.toThrow(
      'Template "NonExistent" not found.',
    );
  });

  it("should throw rate limit error on 403 with reset header", async () => {
    const futureTime = Math.floor(Date.now() / 1000) + 120; // 2 minutes from now
    mockFetch.mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 403,
        headers: { "x-ratelimit-reset": String(futureTime) },
      }) as any,
    );

    await expect(fetchTemplate("Node")).rejects.toThrow(
      "GitHub API rate limit exceeded",
    );
  });

  it("should throw rate limit error on 429 with reset header", async () => {
    const futureTime = Math.floor(Date.now() / 1000) + 300;
    mockFetch.mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 429,
        headers: { "x-ratelimit-reset": String(futureTime) },
      }) as any,
    );

    await expect(fetchTemplate("Node")).rejects.toThrow(
      "GitHub API rate limit exceeded",
    );
  });

  it("should throw generic error on 403 without reset header", async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({ ok: false, status: 403 }) as any,
    );

    await expect(fetchTemplate("Node")).rejects.toThrow(
      'Template "Node" not found.',
    );
  });
});

describe("listTemplates", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return a list of template names", async () => {
    const apiResponse = [
      { name: "Node.gitignore" },
      { name: "Python.gitignore" },
      { name: "README.md" },
      { name: "Rust.gitignore" },
    ];
    mockFetch.mockResolvedValue(
      createMockResponse({ json: apiResponse }) as any,
    );

    const result = await listTemplates();
    expect(result).toEqual(["Node", "Python", "Rust"]);
  });

  it("should filter out non-.gitignore files", async () => {
    const apiResponse = [
      { name: "Node.gitignore" },
      { name: "LICENSE" },
      { name: "Global" },
    ];
    mockFetch.mockResolvedValue(
      createMockResponse({ json: apiResponse }) as any,
    );

    const result = await listTemplates();
    expect(result).toEqual(["Node"]);
  });

  it("should return empty array when no .gitignore files exist", async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({ json: [{ name: "README.md" }] }) as any,
    );

    const result = await listTemplates();
    expect(result).toEqual([]);
  });

  it("should throw if API returns non-array", async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({ json: { message: "Not found" } }) as any,
    );

    await expect(listTemplates()).rejects.toThrow(
      "Unexpected response format from GitHub API.",
    );
  });

  it("should throw on API failure", async () => {
    mockFetch.mockResolvedValue(
      createMockResponse({ ok: false, status: 500 }) as any,
    );

    await expect(listTemplates()).rejects.toThrow(
      "Failed to fetch template list from GitHub.",
    );
  });

  it("should throw rate limit error on 429", async () => {
    const futureTime = Math.floor(Date.now() / 1000) + 60;
    mockFetch.mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 429,
        headers: { "x-ratelimit-reset": String(futureTime) },
      }) as any,
    );

    await expect(listTemplates()).rejects.toThrow(
      "GitHub API rate limit exceeded",
    );
  });
});
