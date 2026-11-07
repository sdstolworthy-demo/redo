<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

- Redo is a to-do app. Keep the UI minimal: one list, an input to add an item, a checkbox to complete it. Brand it "Redo".
- End-to-end tests use Playwright and live in `e2e/`. They run in GitHub Actions on every pull request, against the pull request's Amplify Gen 3 preview deployment, not against a local server. The workflow is `.github/workflows/e2e.yml`, named `e2e against preview`. It waits for the Amplify Gen 3 check run on the PR's head commit to complete with success, takes that check run's `details_url` as the preview URL (the check run's name starts with "Amplify Gen 3" or "Omega"), and runs the tests with `PLAYWRIGHT_BASE_URL` set to it. Use the default `GITHUB_TOKEN`; no secrets are needed.
- Print the preview URL the tests ran against in the job log.
- All visitors share one list. Never scope to-dos to a browser, cookie or user.
- End-to-end tests delete every to-do they create, including on failure, so the shared list stays as the user left it.
