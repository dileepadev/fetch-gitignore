# Fetch .gitignore

A terminal/CLI tool using Node.js that allows developers to fetch official .gitignore templates from GitHub and save them to their project. This tool will simplify initializing projects with the correct .gitignore and improve developer productivity.
Here is a **step-by-step developer guideline** to build your `fetch-gitignore` CLI tool using Node.js.

We’ll fetch official templates from the **GitHub** repository:
👉 **github/gitignore**

---

# 🌱 Step-by-Step Developer Guide

---

# 1️⃣ Initialize the Project

```bash
mkdir fetch-gitignore
cd fetch-gitignore
npm init -y
```

Install required dependencies:

```bash
npm install commander node-fetch chalk
```

(Optional for dev)

```bash
npm install -D nodemon
```

---

# 2️⃣ Configure CLI Entry Point

### Update `package.json`

Add:

```json
{
  "name": "fetch-gitignore",
  "version": "1.0.0",
  "bin": {
    "fetch-gitignore": "./bin/index.js"
  },
  "type": "module"
}
```

This makes it globally executable.

---

# 3️⃣ Create Project Structure

```
fetch-gitignore/
│
├── bin/
│   └── index.js
│
├── lib/
│   ├── fetchTemplate.js
│   ├── saveTemplate.js
│   └── listTemplates.js
│
└── cache/
```

---

# 4️⃣ Setup CLI with Commander

### `bin/index.js`

```js
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fetchTemplate from '../lib/fetchTemplate.js';
import saveTemplate from '../lib/saveTemplate.js';
import listTemplates from '../lib/listTemplates.js';

const program = new Command();

program
  .name('fetch-gitignore')
  .description('CLI to fetch official .gitignore templates')
  .version('1.0.0');

program
  .command('list')
  .description('List available templates')
  .action(async () => {
    await listTemplates();
  });

program
  .argument('[template]', 'Template name (e.g. Node, Python)')
  .option('-d, --dir <directory>', 'Target directory', process.cwd())
  .option('-a, --append', 'Append to existing .gitignore')
  .action(async (template, options) => {
    if (!template) {
      console.log(chalk.red('Please provide a template name.'));
      return;
    }

    const content = await fetchTemplate(template);
    await saveTemplate(content, options.dir, options.append);
  });

program.parse();
```

Make executable:

```bash
chmod +x bin/index.js
```

---

# 5️⃣ Fetch Templates from GitHub

Templates live at:

```
https://raw.githubusercontent.com/github/gitignore/main/<Template>.gitignore
```

---

### `lib/fetchTemplate.js`

```js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const BASE_URL =
  'https://raw.githubusercontent.com/github/gitignore/main';

export default async function fetchTemplate(name) {
  const fileName = `${name}.gitignore`;
  const url = `${BASE_URL}/${fileName}`;

  try {
    console.log(chalk.blue(`Fetching ${fileName}...`));

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Template not found');
    }

    const text = await res.text();

    // Cache template
    const cachePath = path.join('cache', fileName);
    fs.writeFileSync(cachePath, text);

    console.log(chalk.green('Template fetched successfully.'));
    return text;
  } catch (err) {
    console.log(chalk.yellow('Using cached version if available...'));

    const cachePath = path.join('cache', fileName);

    if (fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8');
    }

    console.log(chalk.red(err.message));
    process.exit(1);
  }
}
```

---

# 6️⃣ Save or Append to `.gitignore`

### `lib/saveTemplate.js`

```js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export default async function saveTemplate(content, dir, append) {
  const targetPath = path.join(dir, '.gitignore');

  if (fs.existsSync(targetPath) && !append) {
    console.log(
      chalk.yellow('.gitignore exists. Use --append to append instead.')
    );
    return;
  }

  if (append) {
    fs.appendFileSync(targetPath, '\n' + content);
    console.log(chalk.green('Appended to existing .gitignore'));
  } else {
    fs.writeFileSync(targetPath, content);
    console.log(chalk.green('Created .gitignore successfully.'));
  }
}
```

---

# 7️⃣ Implement `list` Command

To list templates dynamically, fetch repository contents from GitHub API:

```
https://api.github.com/repos/github/gitignore/contents
```

---

### `lib/listTemplates.js`

```js
import fetch from 'node-fetch';
import chalk from 'chalk';

export default async function listTemplates() {
  const url =
    'https://api.github.com/repos/github/gitignore/contents';

  const res = await fetch(url);
  const data = await res.json();

  const templates = data
    .filter(file => file.name.endsWith('.gitignore'))
    .map(file => file.name.replace('.gitignore', ''));

  console.log(chalk.blue('Available templates:\n'));
  templates.forEach(t => console.log(chalk.green(t)));
}
```

---

# 8️⃣ Test Locally

Link globally:

```bash
npm link
```

Test:

```bash
fetch-gitignore Node
fetch-gitignore Python --append
fetch-gitignore list
```

---

# 9️⃣ Publish to npm

Login:

```bash
npm login
```

Publish:

```bash
npm publish --access public
```

Users can now install globally:

```bash
npm install -g fetch-gitignore
```

---

# 🔟 Optional Improvements (Recommended)

## ✅ Auto-detect existing .gitignore type

## ✅ Add multiple template support

```bash
fetch-gitignore Node,React,macOS
```

## ✅ Add interactive mode

Use `inquirer`

## ✅ Add GitHub API rate-limit handling

## ✅ Add template search feature

## ✅ Add unit tests (Jest)

---

# 🏗 Architecture Summary

| Feature         | Implementation           |
| --------------- | ------------------------ |
| CLI Parsing     | commander                |
| HTTP Fetch      | node-fetch               |
| Terminal Colors | chalk                    |
| Caching         | Local `/cache` folder    |
| Global Command  | package.json `bin` field |

---

# 🚀 Final Result

You’ll have a production-ready CLI tool that:

* Fetches official templates from **GitHub**
* Uses **github/gitignore**
* Works offline with caching
* Supports append mode
* Lists available templates
* Is globally installable

---

If you'd like, I can next provide:

* 🧪 Unit testing setup
* 📦 Professional project structure (enterprise level)
* 🔥 Add TypeScript version
* 🛠 Convert to ESM + Axios
* 📄 Add README template for publishing
* 🚀 CI/CD setup for npm publish

Just tell me what level you want to take it to.
