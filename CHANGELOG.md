# Changelog

All notable changes to this project are documented in this file.

Changes are organized into the following categories:

- **Added:** New features or functionality introduced to the project.
- **Changed:** Modifications to existing functionality that do not add new features.
- **Fixed:** Bug fixes that resolve issues or correct unintended behavior.
- **Removed:** Features or components that have been removed from the project.

## [Unreleased]

- Changes for the next release are available in development branches.

## [1.0.2] - 2026-02-21

### Fixed - v1.0.2

- Read CLI version dynamically from `package.json` instead of using a hardcoded string.

## [1.0.1] - 2026-02-21

### Fixed - v1.0.1

- Bump version to 1.0.1 for safe republishing after accidental npm unpublish of v1.0.0.

## [1.0.0] - 2026-02-21

### Added - v1.0.0

- Built a Node.js CLI tool called `fetch-gitignore` using TypeScript.
- Support fetching `.gitignore` templates by name from [github/gitignore](https://github.com/github/gitignore).
- Save the fetched template as `.gitignore` in the current directory.
- Save the fetched template as `.gitignore` in a selected directory via `--dir` / `-d`.
- Option to append to an existing `.gitignore` instead of overwriting via `--append` / `-a`.
- **`fetch-gitignore list`** command to show all available templates.
- **`fetch-gitignore add <templates...>`** command to fetch and save one or more templates.
- Clear terminal feedback with colorized output using [Chalk](https://github.com/chalk/chalk).
- Made the CLI globally executable via npm (`npm install -g @dileepadev/fetch-gitignore`).
- Template validation — throws a clear error when a template name is not found.
- `--force` / `-f` flag to overwrite an existing `.gitignore` file.
- Multiple templates support — combine several templates into a single `.gitignore` with numbered section headers.
- Spinner feedback using [Ora](https://github.com/sindresorhus/ora) while fetching templates.
- Rate-limit handling — detects GitHub API 403/429 responses and reports how long to wait before retrying.
- `--no-cache` option to bypass local cache and fetch directly from GitHub.
- Local caching of templates and template list (default TTL: 24 hours) with `FETCH_GITIGNORE_CACHE_TTL` environment variable support.
- Full Vitest unit and integration test suite covering all modules and the CLI binary.

<!-- e.g., -->
<!-- Unreleased -->
<!-- v2.0.0 -->
<!-- v1.1.0 -->
<!-- v1.0.0 -->
<!-- v0.0.1 -->

[Unreleased]: https://github.com/dileepadev/fetch-gitignore/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/dileepadev/fetch-gitignore/releases/tag/v1.0.2
[1.0.1]: https://github.com/dileepadev/fetch-gitignore/releases/tag/v1.0.1
[1.0.0]: https://github.com/dileepadev/fetch-gitignore/releases/tag/v1.0.0
