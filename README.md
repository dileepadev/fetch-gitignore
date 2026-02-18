# Fetch .gitignore 🛡️

A professional terminal/CLI tool built with Node.js that simplifies initializing projects with official `.gitignore` templates from the [GitHub gitignore repository](https://github.com/github/gitignore).

Stop manually searching and copy-pasting `.gitignore` content—fetch and save them directly from your terminal!

## 🚀 Features

- **Dynamic Fetching**: Pulls the latest templates directly from the official GitHub repository.
- **Multiple Templates**: Combine multiple `.gitignore` templates (e.g., `Node`, `Python`, `Visual Studio Code`).
- **Caching**: Local caching of templates for faster access and offline use.
- **Safety**: Prevents accidental overwriting of existing `.gitignore` files unless forced.
- **Append Mode**: Easily add new rules to your existing `.gitignore`.
- **Directory Support**: Target any directory, whether it's your current path or a subproject.
- **Rate Limit Handling**: Smartly handles GitHub API rate limits and provides clear feedback on when to retry.

## 📦 Installation

To use `fetch-gitignore` as a global CLI tool, install it via npm:

```bash
npm install -g fetch-gitignore
```

Or run it instantly using `npx`:

```bash
npx fetch-gitignore list
npx fetch-gitignore add Node
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
| `--help` | `-h` | Display help information. | - |
| `--version` | `-v` | Display the version number. | - |

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

### 🧠 4. Run Without Linking (Alternative)

If you don’t want to use `npm link`, you can run the CLI directly:

```bash
node bin/index.js list
```

or

```bash
node bin/index.js add Node
```

### 📦 5. Test as a Packed npm Module (Production Simulation)

To simulate a real npm installation:

```bash
npm pack
```

This generates a `.tgz` file like:

```text
fetch-gitignore-1.0.0.tgz
```

Then install it globally:

```bash
npm install -g ./fetch-gitignore-1.0.0.tgz
```

Now test it as if it were published.

### 🧹 6. Unlink When Done

To remove the global symlink:

```bash
npm unlink -g fetch-gitignore
```

## 🏗️ Architecture

- **Commander.js**: Powering the CLI command and argument parsing.
- **Node-Fetch**: Used to retrieve template data from GitHub APIs.
- **Chalk & Ora**: Creating a beautiful, interactive terminal experience.
- **File System (fs)**: Reliable management of `.gitignore` files and local caching.

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
chmod +x bin/index.js
```

## 🚀 Development Workflow

During development:

1. Edit code
2. Run `fetch-gitignore`
3. Test behavior
4. Repeat

Because `npm link` creates a symlink, changes apply immediately — no reinstall required.
