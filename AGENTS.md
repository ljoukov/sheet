# AGENTS.md

## README Scope

- Keep `README.md` focused on using the library: what it exports, how to install it, how to render it, and what the components look like.
- Do not turn the main `README.md` into contributor or repo-maintenance documentation.
- Development, validation, screenshotting, gallery, and release instructions belong in `AGENTS.md` instead of the package `README.md`.

## Git Workflow

- In this repository, a user request to `push` means push the current work directly to `origin/main`.
- Do not create or push a feature branch, and do not open a pull request, unless the user explicitly asks for a branch or PR.
- If the current checkout is detached or not on `main`, push with `git push origin HEAD:main`.
- If `origin/main` moved, rebase local work onto it before pushing rather than creating merge commits.

## Screenshot Workflow

- README screenshots must come from the isolated gallery render routes under `/render/*`, not from gallery shell pages with sidebar or header chrome.
- If a surface is documented with a screenshot in `README.md`, keep a matching isolated render route or stable screenshot selector for that exact surface so the image can be regenerated without improvising the crop.
- Each screenshot route should render exactly one capture surface and expose a stable `[data-screenshot-target="..."]` selector. If a README example is hard to crop cleanly, add or adjust a dedicated render route instead of taking a page screenshot.
- Use selector screenshots against the screenshot target, not full-page screenshots. Capture the whole component, avoid extra empty margins, and make sure dark screenshots do not show light-theme strips or mismatched surfaces.
- Capture both light and dark variants for every example referenced in `README.md`. Question examples use `/render/question/<kind>?theme=...`; other components use `/render/<component>?theme=...&state=...` where applicable.
- For batch screenshot work, use separate subagents with separate `agent-browser` sessions per component or question kind. Keep `view_image` checks inside the subagents so the main context stays clean.
- Visually inspect saved screenshots before finishing. If a standalone render has the wrong theme, fix the component or render-route theming rather than accepting a bad screenshot.

## UI Debug Flow

- For visual bugs, reproduce them on the smallest isolated render route that shows exactly one component in the relevant state and theme.
- Start the gallery dev server, use the actual local URL it prints, and open the matching `/render/*` route instead of a full gallery page.
- Capture selector screenshots from `[data-screenshot-target="..."]`, not the whole page, so the debug artifact matches the component boundary.
- Use subagents for visual inspection and keep `view_image` calls inside those subagents. Compare the saved README screenshot against a fresh live capture before deciding whether the problem is a stale PNG or a real UI bug.
- If the live render is wrong, fix the component or its standalone theme shell first, then recapture the affected screenshots and re-check them visually.
- When the visual debugging pass is done, stop the gallery dev server before running `npm run verify` or `npm run gallery:build`.

## Development Workflow

- Use `npm run check`, `npm test`, and `npm run build` for library validation.
- Use `npm run gallery:dev` to run the gallery app locally, `npm run gallery:check` for gallery type checks, and `npm run gallery:build` for a production gallery build.
- When you need a specific gallery port, run `npm run gallery:dev -- --port <port>`. The repo wrapper injects the default host and port only when they were not provided, so forwarded flags should not duplicate or fight the defaults.
- `npm run verify` is the full validation pass used by CI: lint, check, test, library build/package, gallery check, and gallery build.
- Do not leave a running gallery dev server around when validating `npm run verify` or `npm run gallery:build`; it can interfere with `.svelte-kit` build output in `examples/gallery`.
- The gallery exists for local component review and screenshot capture. Keep usage-oriented showcase content in `README.md`, and keep route lists, contributor workflows, and capture procedures here.

## Releases

- Publishing is handled through GitHub Actions, not by running `npm publish` locally, unless the user explicitly asks for a manual publish flow.
- CI is defined in `.github/workflows/ci.yml` and runs `npm run verify` on pushes to `main` and on pull requests across Node 22 and Node 24.
- Publishing is defined in `.github/workflows/publish.yml`. It runs on pushes of tags matching `v*`, or manually through `workflow_dispatch` with a required `tag` input.
- The publish workflow checks out the tagged ref, runs `npm ci`, validates that the tag matches `package.json` exactly, runs `npm run verify`, and only then runs `npm publish` using GitHub Actions trusted publishing.
- Normal release flow for this repo: bump `package.json` version, make sure `npm run verify` passes, push the release commit to `origin/main`, then create and push the matching `vX.Y.Z` tag to trigger the GitHub publish workflow.
