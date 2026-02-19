import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { saveToCache, getFromCache } from "../src/cache.js";

const CACHE_DIR = path.join(os.homedir(), ".fetch-gitignore-cache");

describe("cache", () => {
  const testName = `vitest-cache-${Date.now()}`;
  const testContent = "# Test gitignore content\nnode_modules/\n";

  afterEach(() => {
    // Clean up test cache files
    const extensions = ["gitignore", "json"];
    for (const ext of extensions) {
      const filePath = path.join(CACHE_DIR, `${testName}.${ext}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    // Restore env
    delete process.env.FETCH_GITIGNORE_CACHE_TTL;
  });

  describe("saveToCache", () => {
    it("should save content with default .gitignore extension", () => {
      saveToCache(testName, testContent);
      const filePath = path.join(CACHE_DIR, `${testName}.gitignore`);
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, "utf-8")).toBe(testContent);
    });

    it("should save content with custom extension", () => {
      saveToCache(testName, '["Node","Python"]', "json");
      const filePath = path.join(CACHE_DIR, `${testName}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, "utf-8")).toBe('["Node","Python"]');
    });

    it("should create the cache directory if it does not exist", () => {
      // This is inherently tested by running saveToCache on a clean system,
      // but we verify the directory exists after saving
      saveToCache(testName, testContent);
      expect(fs.existsSync(CACHE_DIR)).toBe(true);
    });
  });

  describe("getFromCache", () => {
    it("should return cached content when valid", () => {
      saveToCache(testName, testContent);
      const result = getFromCache(testName);
      expect(result).toBe(testContent);
    });

    it("should return null for non-existent cache entry", () => {
      const result = getFromCache("nonexistent-template-xyz");
      expect(result).toBeNull();
    });

    it("should return null when TTL is set to 0 (caching disabled)", () => {
      saveToCache(testName, testContent);
      process.env.FETCH_GITIGNORE_CACHE_TTL = "0";
      const result = getFromCache(testName);
      expect(result).toBeNull();
    });

    it("should return content when within custom TTL", () => {
      saveToCache(testName, testContent);
      process.env.FETCH_GITIGNORE_CACHE_TTL = "3600"; // 1 hour
      const result = getFromCache(testName);
      expect(result).toBe(testContent);
    });

    it("should return null when cache entry has expired", () => {
      saveToCache(testName, testContent);
      // Set TTL to 0 seconds to simulate expiration
      process.env.FETCH_GITIGNORE_CACHE_TTL = "0";
      const result = getFromCache(testName);
      expect(result).toBeNull();
    });

    it("should use default TTL for invalid env values", () => {
      saveToCache(testName, testContent);
      process.env.FETCH_GITIGNORE_CACHE_TTL = "notanumber";
      // Default TTL is 24h, so file just saved should be valid
      const result = getFromCache(testName);
      expect(result).toBe(testContent);
    });

    it("should use default TTL for negative env values", () => {
      saveToCache(testName, testContent);
      process.env.FETCH_GITIGNORE_CACHE_TTL = "-100";
      const result = getFromCache(testName);
      expect(result).toBe(testContent);
    });

    it("should retrieve content with custom extension", () => {
      saveToCache(testName, '["Node"]', "json");
      const result = getFromCache(testName, "json");
      expect(result).toBe('["Node"]');
    });
  });
});
