# Fetch .gitignore 🛡️

A professional terminal/CLI tool built with Node.js that simplifies initializing projects with official `.gitignore` templates from the [GitHub gitignore repository](https://github.com/github/gitignore).

Stop manually searching and copy-pasting `.gitignore` content—fetch and save them directly from your terminal!

## Table of Contents

- [Fetch .gitignore 🛡️](#fetch-gitignore-️)
  - [Table of Contents](#table-of-contents)
  - [🚀 Features](#-features)
  - [📦 Installation](#-installation)
  - [🛠️ Usage](#️-usage)
    - [1. List Available Templates](#1-list-available-templates)
    - [2. Add a Template](#2-add-a-template)
    - [3. Combine Multiple Templates](#3-combine-multiple-templates)
    - [4. Options](#4-options)
    - [💾 Cache Configuration](#-cache-configuration)
  - [🧪 Local Development \& Testing](#-local-development--testing)
    - [📦 Prerequisites](#-prerequisites)
    - [🔧 1. Install Dependencies](#-1-install-dependencies)
    - [🔗 2. Link the CLI Globally (Recommended)](#-2-link-the-cli-globally-recommended)
    - [🧪 3. Test the CLI](#-3-test-the-cli)
      - [List available templates](#list-available-templates)
      - [Create a `.gitignore` file](#create-a-gitignore-file)
      - [Append to existing `.gitignore`](#append-to-existing-gitignore)
      - [Overwrite existing `.gitignore`](#overwrite-existing-gitignore)
      - [Add multiple templates](#add-multiple-templates)
      - [Specify target directory](#specify-target-directory)
      - [Force a refresh (bypass cache)](#force-a-refresh-bypass-cache)
    - [🧠 4. Run Without Linking (Alternative)](#-4-run-without-linking-alternative)
    - [📦 5. Test as a Packed npm Module (Production Simulation)](#-5-test-as-a-packed-npm-module-production-simulation)
    - [🧹 6. Unlink When Done](#-6-unlink-when-done)
  - [🧪 Running Tests](#-running-tests)
    - [Run All Tests](#run-all-tests)
    - [Run Tests in Watch Mode](#run-tests-in-watch-mode)
    - [Run Tests with Coverage](#run-tests-with-coverage)
    - [Test Structure](#test-structure)
  - [🏗️ Architecture](#️-architecture)
  - [🤝 Contributing](#-contributing)
  - [📜 License](#-license)
  - [🐛 Troubleshooting](#-troubleshooting)
    - [Command not found?](#command-not-found)
    - [Permission issues (macOS/Linux)](#permission-issues-macoslinux)
  - [🚀 Development Workflow](#-development-workflow)

## 🚀 Features

- **Dynamic Fetching**: Pulls the latest templates directly from the official GitHub repository.
- **Multiple Templates**: Combine multiple `.gitignore` templates (e.g., `Node`, `Python`, `Visual Studio Code`).
- **Caching**: Local caching of templates and list for faster access and offline use.
- **Safety**: Prevents accidental overwriting of existing `.gitignore` files unless forced.
- **Append Mode**: Easily add new rules to your existing `.gitignore`.
- **Directory Support**: Target any directory, whether it's your current path or a subproject.
- **Rate Limit Handling**: Smartly handles GitHub API rate limits and provides clear feedback on when to retry.

## 📦 Installation

To use `fetch-gitignore` as a global CLI tool, install it via npm:

```bash
npm install -g @dileepadev/fetch-gitignore
```

Or run it instantly using `npx`:

```bash
npx @dileepadev/fetch-gitignore list
npx @dileepadev/fetch-gitignore add Node
```

## 🛠️ Usage

### 1. List Available Templates

To see all templates available in the official GitHub repository:

```bash
fetch-gitignore list
```

### 2. Add a Template

To create a new `.gitignore` file for your project:

```bash
fetch-gitignore add <TemplateName>
```

*Example: `fetch-gitignore add Node`*

### 3. Combine Multiple Templates

You can pass multiple template names to merge them into a single `.gitignore` file:

```bash
fetch-gitignore add Node Python Rust
```

### 4. Options

| Option | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--dir <path>` | `-d` | Target directory where `.gitignore` will be saved. | `.` |
| `--append` | `-a` | Append content to an existing `.gitignore` file. | `false` |
| `--force` | `-f` | Force overwrite an existing `.gitignore` file. | `false` |
| `--no-cache` | - | Bypass local cache and fetch directly from GitHub. | `false` |
| `--help` | `-h` | Display help information. | - |
| `--version` | `-V` | Display the version number. | - |

### 💾 Cache Configuration

Templates and the template list are cached locally (usually in `~/.fetch-gitignore-cache`) for 24 hours.

You can customize the Time-To-Live (TTL) using an environment variable:

```bash
# Set cache to expire after 1 hour (3600 seconds)
export FETCH_GITIGNORE_CACHE_TTL=3600
```

To disable caching entirely, set it to `0`:

```bash
export FETCH_GITIGNORE_CACHE_TTL=0
```

## 🧪 Local Development & Testing

This guide explains how to test `fetch-gitignore` locally before publishing to npm.

### 📦 Prerequisites

- Node.js ≥ 18
- npm ≥ 9

Check your version:

```bash
node -v
npm -v
```

### 🔧 1. Install Dependencies

From the project root:

```bash
npm install
```

Build the TypeScript sources:

```bash
npm run build
```

### 🔗 2. Link the CLI Globally (Recommended)

This simulates installing the package globally via `npm install -g`.

```bash
npm link
```

This creates a global symlink so you can run:

```bash
fetch-gitignore
```

from anywhere on your system.

### 🧪 3. Test the CLI

Move to any test directory:

```bash
mkdir test-cli
cd test-cli
```

Then try:

#### List available templates

```bash
fetch-gitignore list
```

#### Create a `.gitignore` file

```bash
fetch-gitignore add Node
```

#### Append to existing `.gitignore`

```bash
fetch-gitignore add Python --append
```

#### Overwrite existing `.gitignore`

```bash
fetch-gitignore add Node --force
```

#### Add multiple templates

```bash
fetch-gitignore add Node Python React
```

#### Specify target directory

```bash
fetch-gitignore add Node --dir ./backend
```

#### Force a refresh (bypass cache)

```bash
fetch-gitignore list --no-cache
fetch-gitignore add Node --no-cache
```

### 🧠 4. Run Without Linking (Alternative)

If you don’t want to use `npm link`, you can run the CLI directly:

```bash
node dist/bin/index.js list
```

or

```bash
node dist/bin/index.js add Node
```

### 📦 5. Test as a Packed npm Module (Production Simulation)

To simulate a real npm installation:

```bash
npm pack
```

This generates a `.tgz` file like:

```text
dileepadev-fetch-gitignore-1.0.0.tgz
```

Then install it globally:

```bash
npm install -g ./dileepadev-fetch-gitignore-1.0.0.tgz
```

Now test it as if it were published.

### 🧹 6. Unlink When Done

To remove the global symlink:

```bash
npm unlink -g @dileepadev/fetch-gitignore
```

## 🧪 Running Tests

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Structure

| Test File | Module | Description |
| :--- | :--- | :--- |
| `tests/utils.test.ts` | `resolveDirectory`, `mergeTemplates` | Directory resolution, template merging, edge cases |
| `tests/logger.test.ts` | `logSuccess`, `logError`, `logInfo` | Stdout/stderr routing, message content |
| `tests/fileManager.test.ts` | `writeGitignore` | Create, overwrite, append, conflict errors |
| `tests/cache.test.ts` | `saveToCache`, `getFromCache` | Save/load, TTL logic, env var overrides |
| `tests/fetcher.test.ts` | `fetchTemplate`, `listTemplates` | Mocked HTTP: success, 404, rate limits, response parsing |
| `tests/cli.test.ts` | CLI binary | `--help`, `--version`, subcommands, error handling |

## 🏗️ Architecture

- **TypeScript**: Strict, type-safe codebase compiled to ESM.
- **Commander.js**: Powering the CLI command and argument parsing.
- **Node-Fetch**: Used to retrieve template data from GitHub APIs.
- **Chalk & Ora**: Creating a beautiful, interactive terminal experience.
- **File System (fs)**: Reliable management of `.gitignore` files and local caching.
- **Vitest**: Fast, TypeScript-native test framework for unit and integration tests.

## 🤝 Contributing

Contributions are welcome! Please check our **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines on how to get started.

## 📜 License

Distributed under the MIT License. See **[LICENSE](LICENSE)** for more information.

## 🐛 Troubleshooting

### Command not found?

Make sure `npm link` ran successfully. You can verify it with:

```bash
which fetch-gitignore
```

### Permission issues (macOS/Linux)

Ensure your CLI entry file is executable:

```bash
chmod +x dist/bin/index.js
```

## 🚀 Development Workflow

During development:

1. Edit code
2. Run `npm run build`
3. Run `fetch-gitignore`
4. Test behavior
5. Repeat

Because `npm link` creates a symlink, changes apply immediately — no reinstall required.
