import fs from 'fs';
import path from 'path';

export function writeGitignore(content, dir, options = {}) {
  const { append = false, force = false } = options;

  const filePath = path.join(dir, '.gitignore');

  const exists = fs.existsSync(filePath);

  if (exists && !append && !force) {
    throw new Error(
      '.gitignore already exists. Use --append or --force.'
    );
  }

  if (append && exists) {
    fs.appendFileSync(filePath, '\n' + content);
    return;
  }

  fs.writeFileSync(filePath, content);
}
