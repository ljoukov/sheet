<script lang="ts">
	import LegacySheet from './components/sheet/paper-sheet.svelte';
	import type {
		PaperSheetAnswers,
		PaperSheetData,
		PaperSheetFeedbackThread,
		PaperSheetReview,
		SheetDocument,
		SheetFeedbackStateMap,
		SheetMode,
		SheetReplyPayload
	} from './types.js';

	type Props = {
		document: SheetDocument;
		answers?: PaperSheetAnswers;
		seedAnswers?: PaperSheetAnswers;
		review?: PaperSheetReview | null;
		mockReview?: PaperSheetReview | null;
		feedbackThreads?: Record<string, PaperSheetFeedbackThread>;
		feedbackState?: SheetFeedbackStateMap;
		mode?: SheetMode;
		allowReplies?: boolean;
		showCompletedFeedbackCards?: boolean;
		showFooter?: boolean;
		footerLabel?: string | null;
		gradeLabel?: string;
		grading?: boolean;
		onAnswersChange?: (answers: PaperSheetAnswers) => void;
		onGrade?: (answers: PaperSheetAnswers) => boolean | Promise<boolean> | void | Promise<void>;
		onReply?: (
			questionId: string,
			payload: SheetReplyPayload
		) => boolean | Promise<boolean> | void | Promise<void>;
	};

	let {
		document,
		answers = $bindable<PaperSheetAnswers>({}),
		seedAnswers = undefined,
		review = null,
		mockReview = null,
		feedbackThreads = {},
		feedbackState = {},
		mode = 'interactive',
		allowReplies = false,
		showCompletedFeedbackCards = true,
		showFooter = true,
		footerLabel = null,
		gradeLabel = 'Grade',
		grading = false,
		onAnswersChange = undefined,
		onGrade = undefined,
		onReply = undefined
	}: Props = $props();

	function hasAnswers(value: PaperSheetAnswers | undefined): boolean {
		return value !== undefined && Object.keys(value).length > 0;
	}

	const effectiveDocument = $derived.by((): PaperSheetData => {
		return {
			...document,
			...(hasAnswers(seedAnswers)
				? { initialAnswers: seedAnswers }
				: hasAnswers(answers)
					? { initialAnswers: answers }
					: {}),
			...(mockReview ? { mockReview } : {})
		};
	});

	const reviewMode = $derived.by(() => {
		switch (mode) {
			case 'interactive':
			case 'readonly':
				return 'none' as const;
			case 'review':
				return 'live' as const;
			case 'demo':
				return 'mock' as const;
		}
	});

	const editable = $derived(mode === 'interactive' || mode === 'demo');

	const feedbackSending = $derived.by(() => {
		const next: Record<string, boolean> = {};
		for (const [questionId, state] of Object.entries(feedbackState)) {
			if (state.sending) {
				next[questionId] = true;
			}
		}
		return next;
	});

	const feedbackRuntimeStatuses = $derived.by(() => {
		const next: Record<string, 'connecting' | 'thinking' | 'responding'> = {};
		for (const [questionId, state] of Object.entries(feedbackState)) {
			if (state.runtimeStatus) {
				next[questionId] = state.runtimeStatus;
			}
		}
		return next;
	});

	const feedbackThinking = $derived.by(() => {
		const next: Record<string, string> = {};
		for (const [questionId, state] of Object.entries(feedbackState)) {
			if (state.thinkingText) {
				next[questionId] = state.thinkingText;
			}
		}
		return next;
	});

	const feedbackAssistantDrafts = $derived.by(() => {
		const next: Record<string, string> = {};
		for (const [questionId, state] of Object.entries(feedbackState)) {
			if (state.assistantDraftText) {
				next[questionId] = state.assistantDraftText;
			}
		}
		return next;
	});

	function handleAnswersChange(nextAnswers: PaperSheetAnswers): void {
		answers = nextAnswers;
		onAnswersChange?.(nextAnswers);
	}

	function handleReply(
		questionId: string,
		draft: string,
		attachments: File[]
	): boolean | void | Promise<boolean> | Promise<void> {
		const result = onReply?.(questionId, {
			text: draft,
			attachments,
			review: review?.questions[questionId] ?? mockReview?.questions[questionId] ?? null,
			thread: feedbackThreads[questionId] ?? null
		});

		if (!result || typeof result === 'boolean') {
			return result;
		}

		return Promise.resolve(result).then((value) => {
			if (value === false) {
				return false as boolean;
			}
			return undefined;
		}) as Promise<boolean> | Promise<void>;
	}
</script>

<LegacySheet
	sheet={effectiveDocument}
	{review}
	{answers}
	{reviewMode}
	{feedbackThreads}
	{feedbackSending}
	{feedbackRuntimeStatuses}
	{feedbackThinking}
	{feedbackAssistantDrafts}
	{editable}
	allowFeedbackReplies={allowReplies}
	{showCompletedFeedbackCards}
	{showFooter}
	{footerLabel}
	{gradeLabel}
	{grading}
	onAnswersChange={handleAnswersChange}
	{onGrade}
	onReplyToTutor={handleReply}
/>
