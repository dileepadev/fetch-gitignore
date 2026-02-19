import fs from "fs";
import os from "os";
import path from "path";

const CACHE_DIR = path.join(os.homedir(), ".fetch-gitignore-cache");
const DEFAULT_TTL_SECONDS = 24 * 60 * 60;

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCacheTTL(): number {
  const raw = process.env.FETCH_GITIGNORE_CACHE_TTL;
  const parsed = raw ? Number(raw) : Number.NaN;
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_TTL_SECONDS;
  }
  return Math.floor(parsed);
}

export function saveToCache(
  name: string,
  content: string,
  extension = "gitignore",
): void {
  ensureCacheDir();
  const filename = extension ? `${name}.${extension}` : name;
  const filePath = path.join(CACHE_DIR, filename);
  fs.writeFileSync(filePath, content, "utf-8");
}

export function getFromCache(
  name: string,
  extension = "gitignore",
): string | null {
  const filename = extension ? `${name}.${extension}` : name;
  const filePath = path.join(CACHE_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const ttl = getCacheTTL();
  if (ttl === 0) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      return null;
    }
    return null;
  }

  const stats = fs.statSync(filePath);
  const ageSeconds = (Date.now() - stats.mtimeMs) / 1000;

  if (ageSeconds > ttl) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      return null;
    }
    return null;
  }

  return fs.readFileSync(filePath, "utf-8");
}
