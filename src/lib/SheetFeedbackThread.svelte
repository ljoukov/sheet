<script lang="ts">
	import LegacyFeedbackThread from './components/sheet/paper-sheet-feedback-chat.svelte';
	import { normalizeTutorMarkdown } from './internal/normalize-feedback-markdown.js';
	import type {
		PaperSheetComposerAttachmentDraft,
		PaperSheetFeedbackThread,
		SheetRuntimeStatus
	} from './types.js';

	type Props = {
		thread?: PaperSheetFeedbackThread | null;
		draft?: string;
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
		placeholder?: string;
		questionLabel?: string;
		onRequestFollowUp?: () => void;
		onAttachFiles?: (files: File[]) => void | Promise<void>;
		onRemoveDraftAttachment?: (localId: string) => void;
		onDraftChange?: (value: string) => void;
		onReply?: (value?: string) => void;
	};

	let {
		thread = null,
		draft = '',
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
		placeholder = 'Write your reply here...',
		questionLabel = 'question',
		onRequestFollowUp = undefined,
		onAttachFiles = undefined,
		onRemoveDraftAttachment = undefined,
		onDraftChange = undefined,
		onReply = undefined
	}: Props = $props();

	const displayThread = $derived(thread?.turns ?? []);
	const runtimeLocked = $derived(
		processing || runtimeStatus !== null || thread?.status === 'responding'
	);
	const showAssistantDraft = $derived.by(() => {
		if (!assistantDraftText) {
			return false;
		}
		const normalized = normalizeTutorMarkdown(assistantDraftText);
		const lastTurn = displayThread.at(-1);
		return lastTurn?.speaker !== 'tutor' || normalizeTutorMarkdown(lastTurn.text) !== normalized;
	});
</script>

<LegacyFeedbackThread
	{displayThread}
	{processing}
	{thinkingText}
	{assistantDraftText}
	{showAssistantDraft}
	{showComposer}
	{showFollowUpButton}
	{resolvedFollowUpMode}
	{draft}
	{draftAttachments}
	{draftAttachmentError}
	{allowAttachments}
	{allowTakePhoto}
	{placeholder}
	{questionLabel}
	composerDisabled={runtimeLocked}
	{runtimeLocked}
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
