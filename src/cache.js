import fs from 'fs';
import os from 'os';
import path from 'path';

const CACHE_DIR = path.join(os.homedir(), '.fetch-gitignore-cache');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function saveToCache(name, content) {
  ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${name}.gitignore`);
  fs.writeFileSync(filePath, content);
}

export function getFromCache(name) {
  const filePath = path.join(CACHE_DIR, `${name}.gitignore`);

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  return null;
}
