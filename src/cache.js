import os from 'os';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(os.homedir(), '.fetch-gitignore-cache');

export function saveToCache(name, content) {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }

  fs.writeFileSync(path.join(CACHE_DIR, name), content);
}

export function getFromCache(name) {
  const filePath = path.join(CACHE_DIR, name);

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  return null;
}
