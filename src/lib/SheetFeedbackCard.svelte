<script lang="ts">
	import LegacyFeedbackCard from './components/sheet/paper-sheet-question-feedback.svelte';
	import type {
		PaperSheetComposerAttachmentDraft,
		PaperSheetFeedbackThread,
		PaperSheetQuestionReview,
		SheetRuntimeStatus
	} from './types.js';

	type Props = {
		review: PaperSheetQuestionReview;
		open?: boolean;
		draft?: string;
		thread?: PaperSheetFeedbackThread | null;
		processing?: boolean;
		runtimeStatus?: SheetRuntimeStatus | null;
		thinkingText?: string | null;
		assistantDraftText?: string | null;
		responseMode?: 'inline' | 'modal';
		showComposer?: boolean;
		showFollowUpButton?: boolean;
		resolvedFollowUpMode?: boolean;
		draftAttachments?: PaperSheetComposerAttachmentDraft[];
		draftAttachmentError?: string | null;
		allowAttachments?: boolean;
		allowTakePhoto?: boolean;
		questionLabel?: string;
		onToggle?: (open: boolean) => void;
		onOpenResponse?: () => void;
		onRequestFollowUp?: () => void;
		onAttachFiles?: (files: File[]) => void | Promise<void>;
		onRemoveDraftAttachment?: (localId: string) => void;
		onDraftChange?: (value: string) => void;
		onReply?: (value?: string) => void;
	};

	let {
		review,
		open = $bindable(true),
		draft = '',
		thread = null,
		processing = false,
		runtimeStatus = null,
		thinkingText = null,
		assistantDraftText = null,
		responseMode = 'inline',
		showComposer = true,
		showFollowUpButton = false,
		resolvedFollowUpMode = false,
		draftAttachments = [],
		draftAttachmentError = null,
		allowAttachments = false,
		allowTakePhoto = false,
		questionLabel = 'question',
		onToggle = undefined,
		onOpenResponse = undefined,
		onRequestFollowUp = undefined,
		onAttachFiles = undefined,
		onRemoveDraftAttachment = undefined,
		onDraftChange = undefined,
		onReply = undefined
	}: Props = $props();

	function handleToggle(): void {
		open = !open;
		onToggle?.(open);
	}
</script>

<div class="sheet-feedback-card-shell">
	<LegacyFeedbackCard
		{review}
		{open}
		{draft}
		{thread}
		{processing}
		{runtimeStatus}
		{thinkingText}
		{assistantDraftText}
		{responseMode}
		{showComposer}
		{showFollowUpButton}
		{resolvedFollowUpMode}
		{draftAttachments}
		{draftAttachmentError}
		{allowAttachments}
		{allowTakePhoto}
		{questionLabel}
		onToggle={handleToggle}
		{onOpenResponse}
		{onRequestFollowUp}
		{onAttachFiles}
		{onRemoveDraftAttachment}
		onDraftChange={(value) => {
			onDraftChange?.(value);
		}}
		onReply={(value) => {
			onReply?.(value);
		}}
	/>
</div>

<style>
	.sheet-feedback-card-shell {
		width: 100%;
		min-width: 0;
		--sheet-color: #d6a11e;
		--paper-surface: #ffffff;
		--paper-surface-elevated: #ffffff;
		--paper-surface-soft: #fafafa;
		--paper-border: rgba(148, 163, 184, 0.24);
		--paper-placeholder: #999999;
		--paper-text: #1a1a1a;
		--paper-text-soft: #555555;
		--paper-text-subtle: #888888;
		--paper-card-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
		--paper-lines-markdown-bg: #fdfdfd;
		--paper-review-correct-bg: #edfdf6;
		--paper-review-correct-border: #22a66e;
		--paper-review-correct-text: #1a8c5b;
		--paper-review-incorrect-bg: #fbefe3;
		--paper-review-incorrect-border: #c66317;
		--paper-review-incorrect-text: #c66317;
		--paper-review-teacher-bg: #fff6d8;
		--paper-review-teacher-border: #d6a11e;
		--paper-review-teacher-text: #b07a00;
	}

	:global([data-theme='dark'] .sheet-feedback-card-shell),
	:global(.dark .sheet-feedback-card-shell) {
		--sheet-color: color-mix(in srgb, #d6a11e 72%, #f8fafc);
		--paper-surface: #17142a;
		--paper-surface-elevated: #201c39;
		--paper-surface-soft: #1d1934;
		--paper-border: color-mix(in srgb, var(--sheet-color) 34%, #302850);
		--paper-placeholder: #756a92;
		--paper-text: #e4dff5;
		--paper-text-soft: #a89ec4;
		--paper-text-subtle: #7f739d;
		--paper-card-shadow: 0 18px 36px -28px rgba(2, 6, 23, 0.65);
		--paper-lines-markdown-bg: #1b1732;
		--paper-review-correct-bg: color-mix(in srgb, #22a66e 22%, #1d1934);
		--paper-review-correct-border: #4ade80;
		--paper-review-correct-text: #86efac;
		--paper-review-incorrect-bg: color-mix(in srgb, #c66317 24%, #1d1934);
		--paper-review-incorrect-border: #f59e0b;
		--paper-review-incorrect-text: #fdba74;
		--paper-review-teacher-bg: color-mix(in srgb, #d6a11e 24%, #1d1934);
		--paper-review-teacher-border: #fbbf24;
		--paper-review-teacher-text: #fde68a;
	}
</style>
