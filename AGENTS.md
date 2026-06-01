# Repository Guidelines

## Project Structure & Module Organization

This repository is a Slidev presentation project using pnpm. The main deck lives in
`slides.md`; additional imported slides belong in `pages/`. Vue components used by
the deck live in `components/`, and reusable code snippets or examples belong in
`snippets/`. Deployment config is kept in `netlify.toml` and `vercel.json`.

Generated and local-only output must not be committed: `node_modules/`, `dist/`,
`.remote-assets/`, `.vite-inspect/`, IDE folders, and logs are ignored. Keep
`patches/` committed because it contains the pnpm patch required for the current
Slidev Windows path workaround.

## Build, Test, and Development Commands

- `pnpm i` installs dependencies and applies patched dependencies from the lockfile.
- `pnpm dev` starts the local Slidev server and opens the deck in a browser.
- `pnpm build` builds the hostable static presentation into `dist/`.
- `pnpm export` exports the deck using Slidev export tooling.
- `pnpm format` formats all supported project files with Prettier.
- `pnpm format:check` verifies formatting without writing changes.

There is no dedicated test runner configured for this project. Use `pnpm build` and
`pnpm format:check` as the required validation before submitting changes.

## Coding Style & Naming Conventions

Prettier is the source of truth for formatting. The project uses 2-space indentation,
semicolons, double quotes, trailing commas where valid in ES5, and LF line endings.
Slide markdown is formatted with `prettier-plugin-slidev` via the `slidev` parser for
`slides.md` and `pages/*.md`.

Name Vue components in PascalCase, for example `components/Counter.vue`. Keep snippet
files descriptive and lowercase or kebab-case when adding new examples.

## Testing Guidelines

No coverage threshold or unit-test naming convention exists yet. For changes to slide
content, run `pnpm format:check`. For changes to components, snippets, dependencies,
or Slidev configuration, run both `pnpm format:check` and `pnpm build`.

## Commit & Pull Request Guidelines

The current git history does not establish a meaningful commit convention. Use short,
imperative commit messages such as `Add prettier config` or `Fix Slidev theme import`.

Pull requests should include a concise description, list the commands run for
validation, and mention any visual changes to slides. Include screenshots or exported
slides when layout, theme, or rendered content changes.

## Agent-Specific Instructions

Do not remove `patches/@slidev__cli@52.15.2.patch` unless the Slidev dependency is
upgraded and the Windows conditional-styles issue is verified fixed. Avoid committing
generated `dist/` output or local dev logs.

After each completed work iteration, suggest a concise git commit message that
describes the task that was completed.
