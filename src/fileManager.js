import fs from 'fs';
import path from 'path';

export function writeGitignore(content, dir, append = false) {
  const filePath = path.join(dir, '.gitignore');

  if (append && fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, '\n' + content);
  } else {
    fs.writeFileSync(filePath, content);
  }
}
