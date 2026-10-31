# Repository Guidelines

## Project Structure & Module Organization

This repository is currently empty: no application source, tests, assets, or package/build configuration are present. When adding code, organize it by responsibility (for example, `src/` for implementation, `tests/` for automated checks, and `assets/` for static files). Keep related tests close to the modules they cover or use one consistent top-level test directory.

## Build, Test, and Development Commands

No build or development commands are configured yet. Add commands to this guide when introducing a build system or runtime, and document the expected working directory and prerequisites. Before submitting changes, run the project’s documented checks and report any checks that could not run.

## Coding Style & Naming Conventions

Follow the formatter and linter selected for the language and record their commands here once configured. Use descriptive names that reflect a file’s role; keep filenames consistent with the conventions of the chosen language and framework. Avoid adding dependencies without a clear need.

## Testing Guidelines

There is no test framework or coverage requirement configured. Add tests alongside new behavior and name them so the behavior under test is apparent (for example, `test_<feature>` or `<feature>.test`). Ensure tests are runnable through a documented command before relying on them in review.

## Commit & Pull Request Guidelines

Git history is not available in this directory, so no existing commit-message convention can be inferred. Use short, imperative commit subjects (for example, `Add input validation`). Pull requests should explain the change and its motivation, list relevant checks, link related issues when applicable, and include screenshots for user-facing visual changes.

## Security & Configuration

Keep credentials and machine-specific settings out of version control. Provide safe example configuration where needed, and document required environment variables without including secret values.
