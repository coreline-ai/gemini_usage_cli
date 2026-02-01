# Repository Guidelines

## Project Structure & Module Organization
- CLI entrypoint: `src/index.ts` defines commands (`setup`, `scan`, `scan --watch`, `auth`).
- Shared utilities: `src/lib/` for UI (`ui.ts`), logging helpers (`logger.ts`, `setup-helper.ts`), and log parsing (`log-parser.ts`).
- Build output: `dist/` contains the bundled ESM CLI (`index.js`, typings). Docs live in `docs/`.

## Build, Test, and Development Commands
- `npm run build`: Bundle TypeScript via tsup to `dist/` (ESM, generates d.ts).
- `npm run dev`: Watch-mode build for live development.
- `npm start`: Run the built CLI from `dist/index.js`.
- `node dist/index.js scan [-w]`: Snapshot or watch mode for usage logs.
- `node dist/index.js setup`: Interactive logging-rule bootstrap.

## Coding Style & Naming Conventions
- Language: TypeScript (ESM). Strict compiler options enabled.
- Imports: Include `.js` extensions for local files to satisfy NodeNext.
- Formatting: Use 4-space indentation (existing code style). Prefer concise functions and early returns.
- Strings: Prefer double quotes (matching current codebase).
- UI: Keep Google-themed colors and consistent box/emoji patterns defined in `src/lib/ui.ts`.

## Testing Guidelines
- No automated test suite yet. When adding tests, use a light TS-friendly runner (e.g., Vitest/Jest) and colocate under `__tests__/` or alongside modules with `.test.ts` suffix.
- Cover log parsing edge cases (missing file, malformed lines, unsorted timestamps) and CLI command behaviors.

## Commit & Pull Request Guidelines
- Commit messages: present-tense, concise (e.g., `Add watch reload guard`, `Refine log parsing`); include scope when helpful.
- PRs: describe motivation, key changes, and manual test notes; link issues if applicable. Include CLI examples for user-facing changes and screenshots/ascii captures for UI output when relevant.

## Security & Configuration Tips
- Logs live at `~/.gemini/usage.jsonl`; avoid checking user data into git. Ensure created `.antigravity/rules.md` files are local only.
- Do not hardcode API tokens; if persisting, use `conf`-backed config (`src/lib/config.ts`) and mask tokens in output.
