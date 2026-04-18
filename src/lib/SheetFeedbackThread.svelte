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

<div class="sheet-feedback-thread-shell">
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
</div>

<style>
	.sheet-feedback-thread-shell {
		width: 100%;
		min-width: 0;
		--sheet-color: #d6a11e;
		--paper-surface: #ffffff;
		--paper-surface-elevated: #ffffff;
		--paper-surface-soft: #f8f5f0;
		--paper-border: rgba(148, 163, 184, 0.24);
		--paper-placeholder: rgba(148, 163, 184, 0.96);
		--paper-text: #241d19;
		--paper-text-soft: rgba(87, 71, 58, 0.72);
		--paper-text-subtle: rgba(87, 71, 58, 0.42);
		--paper-card-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
		--paper-lines-markdown-bg: #fdfdfd;
		--note-bg: #fff7ed;
		--note-left: #d6a11e;
		--note-user-bg: var(--paper-lines-markdown-bg);
		--note-user-border: color-mix(in srgb, var(--note-left) 24%, var(--paper-border));
		--note-input-border: color-mix(in srgb, var(--note-left) 58%, var(--paper-surface));
		--note-text: var(--paper-text);
		--note-text-muted: var(--paper-text-soft);
		--note-composer-surface: color-mix(in srgb, var(--paper-surface-elevated) 92%, transparent);
		--note-composer-hover: color-mix(
			in srgb,
			var(--paper-text-soft) 10%,
			var(--paper-surface-elevated)
		);
		--note-status-processing: #b07a00;
	}

	:global([data-theme='dark'] .sheet-feedback-thread-shell),
	:global(:root:not([data-theme='light']) .sheet-feedback-thread-shell),
	:global(.dark .sheet-feedback-thread-shell) {
		--sheet-color: color-mix(in srgb, #d6a11e 72%, #f8fafc);
		--paper-surface: #17142a;
		--paper-surface-elevated: #201c39;
		--paper-surface-soft: #1a1630;
		--paper-border: color-mix(in srgb, var(--note-left) 22%, #302850);
		--paper-placeholder: rgba(184, 192, 208, 0.92);
		--paper-text: #f3ede5;
		--paper-text-soft: rgba(224, 214, 204, 0.76);
		--paper-text-subtle: rgba(224, 214, 204, 0.5);
		--paper-card-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
		--paper-lines-markdown-bg: color-mix(
			in srgb,
			var(--paper-surface-elevated) 90%,
			var(--note-left) 10%
		);
		--note-bg: color-mix(in srgb, var(--note-left) 14%, #161224);
		--note-left: #e4ba46;
		--note-user-bg: color-mix(in srgb, var(--paper-surface-elevated) 92%, var(--note-left) 8%);
		--note-user-border: color-mix(in srgb, var(--note-left) 26%, var(--paper-border));
		--note-input-border: color-mix(in srgb, var(--note-left) 58%, var(--paper-surface));
		--note-text: var(--paper-text);
		--note-text-muted: var(--paper-text-soft);
		--note-composer-surface: color-mix(in srgb, var(--paper-surface-elevated) 92%, transparent);
		--note-composer-hover: color-mix(
			in srgb,
			var(--paper-text-soft) 12%,
			var(--paper-surface-elevated)
		);
		--note-status-processing: var(--note-left);
	}
</style>
