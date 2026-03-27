# `@ljoukov/sheet`

Paper-first Svelte components for rendering printable-style worksheets, reviewed answer sheets, rich tutor feedback cards, and reply threads.

The package is built for Svelte 5 component-library usage and ships with a SvelteKit gallery app under [`examples/gallery`](examples/gallery) for route-level visual review plus isolated `/render/*` capture surfaces for documentation screenshots.

## What It Includes

- `Sheet`: full worksheet renderer with interactive, readonly, review, and demo modes
- `SheetFeedbackCard`: question-level review note with optional reply flow
- `SheetFeedbackThread`: standalone tutor thread and composer surface
- `Markdown`: shared markdown renderer with KaTeX maths and syntax highlighting
- typed schemas, exported types, and seeded sample documents for local demos

## Install

```sh
npm install @ljoukov/sheet
```

Import the package stylesheet once so KaTeX and shared utility styles are available:

```svelte
<script lang="ts">
	import '@ljoukov/sheet/styles.css';
</script>
```

## Quick Start

```svelte
<script lang="ts">
	import '@ljoukov/sheet/styles.css';
	import { Sheet, sampleSheets, type SheetAnswers } from '@ljoukov/sheet';

	const sample = sampleSheets[0];
	let answers: SheetAnswers = sample.seedAnswers ?? {};
</script>

<Sheet document={sample.document} mode="demo" mockReview={sample.mockReview} bind:answers />
```

For live tutoring flows, pass `review`, `feedbackThreads`, `feedbackState`, and `onReply` into `Sheet`, or use `SheetFeedbackCard` and `SheetFeedbackThread` directly when you need those surfaces outside the full worksheet layout.

## Gallery

The repo includes a SvelteKit gallery app for full-sheet routes, component demos, and isolated render routes that show exactly one component per screen.

The gallery shell follows a Tailwind v4 and `shadcn-svelte`-style setup with a local [`components.json`](examples/gallery/components.json) so future demo surfaces can adopt the same conventions.

```sh
npm install
npm run gallery:dev
```

Useful routes:

- `/worksheet/roman`
- `/worksheet/iron`
- `/feedback`
- `/thread`
- `/markdown`
- `/questions/fill`
- `/questions/mcq`
- `/questions/lines`
- `/questions/calc`
- `/questions/match`
- `/questions/spelling`
- `/render`
- `/render/sheet?theme=light&state=roman`
- `/render/feedback-card?theme=dark&state=open`
- `/render/feedback-thread?theme=light&state=open`
- `/render/markdown?theme=dark&state=block`

For screenshot work, prefer the isolated render routes over the gallery pages. Each `/render/<component>` path accepts:

- `theme=light|dark`
- `state=<variant>`

Supported states:

- `sheet`: `roman`, `iron`, `english`
- `feedback-card`: `pending`, `open`, `thinking`, `resolved`
- `feedback-thread`: `open`, `responding`
- `markdown`: `block`, `inline`

Typical capture flow:

```sh
npm install
npm run gallery:dev

agent-browser --session readme-card open '<gallery-url>/render/feedback-card?theme=dark&state=open'
agent-browser --session readme-card wait --load networkidle
agent-browser --session readme-card set viewport 1100 720 2
agent-browser --session readme-card screenshot '[data-screenshot-target="feedback-card"]' docs/screenshots/render-feedback-card-dark.png
```

Replace `<gallery-url>` with the local address printed by `npm run gallery:dev`.

## Screenshots

The screenshots below come from the isolated render routes, not the gallery shell.

### `Sheet` (`state=roman`)

<p>
  <img src="docs/screenshots/render-sheet-light.png" alt="Sheet component in light mode" width="49%" />
  <img src="docs/screenshots/render-sheet-dark.png" alt="Sheet component in dark mode" width="49%" />
</p>

### `SheetFeedbackCard` (`state=open`)

<p>
  <img src="docs/screenshots/render-feedback-card-light.png" alt="Feedback card component in light mode" width="49%" />
  <img src="docs/screenshots/render-feedback-card-dark.png" alt="Feedback card component in dark mode" width="49%" />
</p>

### `SheetFeedbackThread` (`state=open`)

<p>
  <img src="docs/screenshots/render-feedback-thread-light.png" alt="Feedback thread component in light mode" width="49%" />
  <img src="docs/screenshots/render-feedback-thread-dark.png" alt="Feedback thread component in dark mode" width="49%" />
</p>

### `Markdown` (`state=block`)

<p>
  <img src="docs/screenshots/render-markdown-light.png" alt="Markdown component in light mode" width="49%" />
  <img src="docs/screenshots/render-markdown-dark.png" alt="Markdown component in dark mode" width="49%" />
</p>

## Development

```sh
npm run check
npm test
npm run build
npm run gallery:check
npm run gallery:build
```

`npm run verify` runs the full library and gallery validation pass used by CI.

## Public API

```ts
import {
	Markdown,
	Sheet,
	SheetFeedbackCard,
	SheetFeedbackThread,
	SheetAnswersSchema,
	SheetDocumentSchema,
	SheetFeedbackAttachmentSchema,
	SheetFeedbackThreadSchema,
	SheetFeedbackTurnSchema,
	SheetReferencesSchema,
	SheetReportSchema,
	SheetReviewSchema,
	sampleSheets,
	type SheetAnswers,
	type SheetDocument,
	type SheetFeedbackState,
	type SheetFeedbackStateMap,
	type SheetFeedbackThreadData,
	type SheetMode,
	type SheetQuestion,
	type SheetQuestionReview,
	type SheetReplyPayload,
	type SheetReview,
	type SheetSample
} from '@ljoukov/sheet';
```

`Sheet` accepts a `document` plus optional `answers`, `seedAnswers`, `review`, `mockReview`, `feedbackThreads`, `feedbackState`, `mode`, `allowReplies`, `showFooter`, `footerLabel`, `onAnswersChange`, and `onReply`.

## Releasing

This package publishes through GitHub Actions using npm trusted publishing.

1. Update `package.json` version.
2. Run `npm run verify`.
3. Commit and push to `main`.
4. Create and push a matching tag such as `v0.1.0`.

```sh
git tag v0.1.0
git push origin main --tags
```

The publish workflow validates that the tag matches `package.json` before running `npm publish`.
