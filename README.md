# `@ljoukov/sheet`

Paper-first Svelte components for rendering printable-style worksheets, reviewed answer sheets, rich tutor feedback cards, and reply threads.

## What It Includes

- `Sheet`: full worksheet renderer with interactive, readonly, review, and demo modes
- `SheetFeedbackCard`: question-level review note with optional reply flow
- `SheetFeedbackThread`: standalone tutor thread and composer surface
- `Markdown`: shared markdown renderer with KaTeX maths and syntax highlighting
- built-in question layouts for fill-in, multiple choice, lines, calculation, matching, and spelling prompts
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

## Screenshots

The screenshots below show the shipped components and built-in question layouts.

### Example sheet

<p>
  <img src="docs/screenshots/render-sheet-light.png" alt="Sheet component in light mode" width="49%" />
  <img src="docs/screenshots/render-sheet-dark.png" alt="Sheet component in dark mode" width="49%" />
</p>

### Feedback card example

<p>
  <img src="docs/screenshots/render-feedback-card-light.png" alt="Feedback card component in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-feedback-card-dark.png" alt="Feedback card component in dark mode" width="100%" />
</p>

### Feedback thread example

<p>
  <img src="docs/screenshots/render-feedback-thread-light.png" alt="Feedback thread component in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-feedback-thread-dark.png" alt="Feedback thread component in dark mode" width="100%" />
</p>

### Markdown example

<p>
  <img src="docs/screenshots/render-markdown-light.png" alt="Markdown component in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-markdown-dark.png" alt="Markdown component in dark mode" width="100%" />
</p>

### Fill-in question example

<p>
  <img src="docs/screenshots/render-question-fill-light.png" alt="Fill-in question example in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-question-fill-dark.png" alt="Fill-in question example in dark mode" width="100%" />
</p>

### Multiple choice question example

<p>
  <img src="docs/screenshots/render-question-mcq-light.png" alt="Multiple choice question example in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-question-mcq-dark.png" alt="Multiple choice question example in dark mode" width="100%" />
</p>

### Lines question example

<p>
  <img src="docs/screenshots/render-question-lines-light.png" alt="Lines question example in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-question-lines-dark.png" alt="Lines question example in dark mode" width="100%" />
</p>

### Calculation question example

<p>
  <img src="docs/screenshots/render-question-calc-light.png" alt="Calculation question example in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-question-calc-dark.png" alt="Calculation question example in dark mode" width="100%" />
</p>

### Matching question example

<p>
  <img src="docs/screenshots/render-question-match-light.png" alt="Matching question example in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-question-match-dark.png" alt="Matching question example in dark mode" width="100%" />
</p>

### Spelling question example

<p>
  <img src="docs/screenshots/render-question-spelling-light.png" alt="Spelling question example in light mode" width="100%" />
</p>
<p>
  <img src="docs/screenshots/render-question-spelling-dark.png" alt="Spelling question example in dark mode" width="100%" />
</p>

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
