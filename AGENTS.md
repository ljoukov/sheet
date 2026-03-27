# AGENTS.md

## Git Workflow

- In this repository, a user request to `push` means push the current work directly to `origin/main`.
- Do not create or push a feature branch, and do not open a pull request, unless the user explicitly asks for a branch or PR.
- If the current checkout is detached or not on `main`, push with `git push origin HEAD:main`.
- If `origin/main` moved, rebase local work onto it before pushing rather than creating merge commits.

## Screenshot Workflow

- README screenshots must come from the isolated gallery render routes under `/render/*`, not from gallery shell pages with sidebar or header chrome.
- Each screenshot route should render exactly one capture surface and expose a stable `[data-screenshot-target="..."]` selector. If a README example is hard to crop cleanly, add or adjust a dedicated render route instead of taking a page screenshot.
- Use selector screenshots against the screenshot target, not full-page screenshots. Capture the whole component, avoid extra empty margins, and make sure dark screenshots do not show light-theme strips or mismatched surfaces.
- Capture both light and dark variants for every example referenced in `README.md`. Question examples use `/render/question/<kind>?theme=...`; other components use `/render/<component>?theme=...&state=...` where applicable.
- For batch screenshot work, use separate subagents with separate `agent-browser` sessions per component or question kind. Keep `view_image` checks inside the subagents so the main context stays clean.
- Visually inspect saved screenshots before finishing. If a standalone render has the wrong theme, fix the component or render-route theming rather than accepting a bad screenshot.

## Releases

- Publishing is handled through GitHub Actions, not by running `npm publish` locally, unless the user explicitly asks for a manual publish flow.
- CI is defined in `.github/workflows/ci.yml` and runs `npm run verify` on pushes to `main` and on pull requests across Node 22 and Node 24.
- Publishing is defined in `.github/workflows/publish.yml`. It runs on pushes of tags matching `v*`, or manually through `workflow_dispatch` with a required `tag` input.
- The publish workflow checks out the tagged ref, runs `npm ci`, validates that the tag matches `package.json` exactly, runs `npm run verify`, and only then runs `npm publish` using GitHub Actions trusted publishing.
- Normal release flow for this repo: bump `package.json` version, make sure `npm run verify` passes, push the release commit to `origin/main`, then create and push the matching `vX.Y.Z` tag to trigger the GitHub publish workflow.
