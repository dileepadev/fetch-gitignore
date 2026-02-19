import path from "path";
import fs from "fs";

export function resolveDirectory(dir: string): string {
  const resolved = path.resolve(dir);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Directory does not exist: ${resolved}`);
  }

  return resolved;
}

export function mergeTemplates(contents: string[]): string {
  return contents
    .map((content, index) => {
      return `# ===== Template ${index + 1} =====\n${content.trim()}\n`;
    })
    .join("\n");
}
