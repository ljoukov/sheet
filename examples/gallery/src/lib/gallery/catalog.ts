export type SheetCatalogCategoryId = 'adjacent' | 'feedback' | 'inputs' | 'structure';

export type SheetCatalogPreviewKind =
	| 'feedback-attachments'
	| 'feedback-card'
	| 'feedback-runtime'
	| 'fill'
	| 'markdown'
	| 'mcq'
	| 'lines'
	| 'calc'
	| 'match'
	| 'review-summary'
	| 'sheet-root'
	| 'spelling';

export type SheetCatalogCategory = {
	description: string;
	id: SheetCatalogCategoryId;
	label: string;
	title: string;
};

export type SheetCatalogItem = {
	answerShape?: string;
	categoryId: SheetCatalogCategoryId;
	component: 'Markdown' | 'Sheet' | 'SheetFeedbackCard' | 'SheetFeedbackThread';
	description: string;
	id: string;
	note?: string;
	optionalInputs?: string[];
	previewKind: SheetCatalogPreviewKind;
	requiredInputs: string[];
	title: string;
};

export const sheetCatalogCategories: SheetCatalogCategory[] = [
	{
		id: 'structure',
		label: 'Structure',
		title: 'Sheet frame and review summary',
		description: 'Top-level worksheet surfaces that define the page shell and grading banner.'
	},
	{
		id: 'inputs',
		label: 'Inputs',
		title: 'Question input types',
		description: 'All problem row variants currently handled by the shared sheet renderer.'
	},
	{
		id: 'feedback',
		label: 'Feedback',
		title: 'Question-level tutor feedback',
		description: 'Conversation surfaces for open notes, streamed responses, and attachment review.'
	},
	{
		id: 'adjacent',
		label: 'Adjacent',
		title: 'Standalone rendering surfaces',
		description: 'Shared adjacent components that are used alongside the worksheet flow.'
	}
] as const;

export const sheetCatalogItems: SheetCatalogItem[] = [
	{
		id: 'sheet-root',
		categoryId: 'structure',
		component: 'Sheet',
		title: 'Sheet root',
		description:
			'Full worksheet surface that owns numbering, theming, section state, answer state, and optional review overlays.',
		requiredInputs: [
			'document.id',
			'document.subject',
			'document.level',
			'document.title',
			'document.subtitle',
			'document.color',
			'document.accent',
			'document.light',
			'document.border',
			'document.sections[]'
		],
		optionalInputs: [
			'seedAnswers',
			'review',
			'mockReview',
			'feedbackThreads',
			'feedbackState',
			'mode',
			'allowReplies',
			'showFooter'
		],
		previewKind: 'sheet-root'
	},
	{
		id: 'review-summary',
		categoryId: 'structure',
		component: 'Sheet',
		title: 'Review summary',
		description:
			'Top-level grading banner that communicates marks, grading message, and whether teacher-review marks remain open.',
		requiredInputs: [
			'review.score.got',
			'review.score.total',
			'review.label',
			'review.message',
			'review.note',
			'review.questions'
		],
		optionalInputs: [
			'review.objectiveQuestionCount',
			'review.teacherReviewMarks',
			'review.teacherReviewQuestionCount'
		],
		previewKind: 'review-summary'
	},
	{
		id: 'fill',
		categoryId: 'inputs',
		component: 'Sheet',
		title: 'Fill in the blanks',
		description:
			'Inline sentence-completion row for short retrieval answers with one or two blank fields.',
		requiredInputs: [
			'question.id',
			'question.type = "fill"',
			'question.marks',
			'question.prompt',
			'question.blanks[]',
			'question.after'
		],
		optionalInputs: ['question.conjunction', 'blank.placeholder', 'blank.minWidth'],
		answerShape: 'answers[question.id] = Record<"0" | "1", string>',
		previewKind: 'fill'
	},
	{
		id: 'mcq',
		categoryId: 'inputs',
		component: 'Sheet',
		title: 'Multiple choice',
		description:
			'Single-select option row with roomy paper buttons and review-aware selection states.',
		requiredInputs: [
			'question.id',
			'question.type = "mcq"',
			'question.marks',
			'question.prompt',
			'question.options[]'
		],
		answerShape: 'answers[question.id] = string',
		note: 'Schema minimum is two options.',
		previewKind: 'mcq'
	},
	{
		id: 'lines',
		categoryId: 'inputs',
		component: 'Sheet',
		title: 'Lines / extended response',
		description:
			'Freeform long-answer row that can stay as a ruled textarea or render locked markdown output.',
		requiredInputs: [
			'question.id',
			'question.type = "lines"',
			'question.marks',
			'question.prompt',
			'question.lines'
		],
		optionalInputs: ['question.renderMode'],
		answerShape: 'answers[question.id] = string',
		note: '`renderMode = "markdown"` switches locked output to rendered markdown.',
		previewKind: 'lines'
	},
	{
		id: 'calc',
		categoryId: 'inputs',
		component: 'Sheet',
		title: 'Calculation row',
		description: 'Compact numeric or symbolic answer row with a left label and a right-side unit.',
		requiredInputs: [
			'question.id',
			'question.type = "calc"',
			'question.marks',
			'question.prompt',
			'question.inputLabel',
			'question.unit'
		],
		optionalInputs: ['question.hint'],
		answerShape: 'answers[question.id] = string',
		previewKind: 'calc'
	},
	{
		id: 'match',
		categoryId: 'inputs',
		component: 'Sheet',
		title: 'Match pairs',
		description:
			'Two-column matching row where the student selects a term, then assigns the paired meaning.',
		requiredInputs: [
			'question.id',
			'question.type = "match"',
			'question.marks',
			'question.prompt',
			'question.pairs[]'
		],
		answerShape: 'answers[question.id] = Record<string, string>',
		note: 'Each pair needs both `term` and `match`.',
		previewKind: 'match'
	},
	{
		id: 'spelling',
		categoryId: 'inputs',
		component: 'Sheet',
		title: 'Spelling correction',
		description:
			'Correction list that shows the misspelled word and captures the repaired spelling inline.',
		requiredInputs: [
			'question.id',
			'question.type = "spelling"',
			'question.marks',
			'question.prompt',
			'question.words[]'
		],
		answerShape: 'answers[question.id] = Record<string, string>',
		note: 'Each word entry currently requires `wrong`.',
		previewKind: 'spelling'
	},
	{
		id: 'feedback-card',
		categoryId: 'feedback',
		component: 'SheetFeedbackCard',
		title: 'Question feedback note',
		description:
			'Review-note surface that combines a tutor note, optional thread, and inline reply composer.',
		requiredInputs: ['review.status', 'review.note', 'questionLabel'],
		optionalInputs: [
			'thread',
			'draft',
			'processing',
			'runtimeStatus',
			'thinkingText',
			'assistantDraftText',
			'showComposer',
			'showFollowUpButton',
			'onDraftChange',
			'onReply'
		],
		previewKind: 'feedback-card'
	},
	{
		id: 'feedback-attachments',
		categoryId: 'feedback',
		component: 'SheetFeedbackThread',
		title: 'Feedback attachments',
		description:
			'Student or tutor turns can include image and file attachments alongside the threaded conversation.',
		requiredInputs: [
			'thread.turns[].id',
			'thread.turns[].speaker',
			'thread.turns[].text or thread.turns[].attachments[]',
			'attachment.id',
			'attachment.filename',
			'attachment.contentType',
			'attachment.sizeBytes'
		],
		optionalInputs: ['attachment.url'],
		previewKind: 'feedback-attachments'
	},
	{
		id: 'feedback-runtime',
		categoryId: 'feedback',
		component: 'SheetFeedbackCard',
		title: 'Runtime feedback progression',
		description:
			'The tutor note can represent pending, thinking, responding, and resolved states while the conversation progresses.',
		requiredInputs: ['review', 'questionLabel'],
		optionalInputs: [
			'thread.status',
			'thread.turns[]',
			'processing',
			'runtimeStatus',
			'thinkingText',
			'assistantDraftText',
			'showComposer',
			'showFollowUpButton'
		],
		previewKind: 'feedback-runtime'
	},
	{
		id: 'markdown',
		categoryId: 'adjacent',
		component: 'Markdown',
		title: 'Markdown surface',
		description:
			'Standalone markdown renderer for prose, maths, tables, and fenced code blocks with theme-aware styling.',
		requiredInputs: ['markdown'],
		optionalInputs: ['inline', 'class'],
		previewKind: 'markdown'
	}
] as const;
