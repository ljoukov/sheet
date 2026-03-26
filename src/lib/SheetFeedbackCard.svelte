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
		showComposer?: boolean;
		showFollowUpButton?: boolean;
		resolvedFollowUpMode?: boolean;
		draftAttachments?: PaperSheetComposerAttachmentDraft[];
		draftAttachmentError?: string | null;
		allowAttachments?: boolean;
		allowTakePhoto?: boolean;
		questionLabel?: string;
		onToggle?: (open: boolean) => void;
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
		showComposer = true,
		showFollowUpButton = false,
		resolvedFollowUpMode = false,
		draftAttachments = [],
		draftAttachmentError = null,
		allowAttachments = false,
		allowTakePhoto = false,
		questionLabel = 'question',
		onToggle = undefined,
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

<LegacyFeedbackCard
	{review}
	{open}
	{draft}
	{thread}
	{processing}
	{runtimeStatus}
	{thinkingText}
	{assistantDraftText}
	{showComposer}
	{showFollowUpButton}
	{resolvedFollowUpMode}
	{draftAttachments}
	{draftAttachmentError}
	{allowAttachments}
	{allowTakePhoto}
	{questionLabel}
	onToggle={handleToggle}
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
