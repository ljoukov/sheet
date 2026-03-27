# Gallery

SvelteKit gallery app for local development, visual QA, and component-level screenshot capture.

Useful commands from the repo root:

```sh
npm run gallery:dev
npm run gallery:check
npm run gallery:build
```

Prefer `/render/*` routes when you need a clean capture surface with no gallery sidebar or header chrome.

Examples:

- `/render/sheet?theme=light&state=roman`
- `/render/feedback-card?theme=dark&state=open`
- `/render/feedback-thread?theme=light&state=open`
- `/render/markdown?theme=dark&state=block`

Each render route accepts `theme=light|dark` plus a component-specific `state` query param.
