# Changelog

All notable changes to this project are documented in this file.

Changes are organized into the following categories:

- **Added:** New features or functionality introduced to the project.
- **Changed:** Modifications to existing functionality that do not add new features.
- **Fixed:** Bug fixes that resolve issues or correct unintended behavior.
- **Removed:** Features or components that have been removed from the project.

## [Unreleased]

- Changes for the next release are available in development branches.

## [1.0.0] - 2026-02-19

### Added

- **`fetch-gitignore list`** command to list all available official `.gitignore` templates from GitHub.
- **`fetch-gitignore add <templates...>`** command to fetch and save one or more `.gitignore` templates.
- `--dir` / `-d` option to specify the target directory.
- `--append` / `-a` option to append to an existing `.gitignore` file.
- `--force` / `-f` option to overwrite an existing `.gitignore` file.
- `--no-cache` option to bypass the local cache and fetch directly from GitHub.
- Local caching of templates and template list (default TTL: 24 hours).
- `FETCH_GITIGNORE_CACHE_TTL` environment variable for configuring cache time-to-live.
- Multi-template merging with numbered section headers.
- GitHub API rate limit detection with helpful retry messages.
- Colorized terminal output using Chalk and Ora spinner.
- Full Vitest unit and integration test suite.

<!-- e.g., -->
<!-- Unreleased -->
<!-- v2.0.0 -->
<!-- v1.1.0 -->
<!-- v1.0.0 -->
<!-- v0.0.1 -->

[Unreleased]: https://github.com/dileepadev/fetch-gitignore/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dileepadev/fetch-gitignore/releases/tag/v1.0.0
