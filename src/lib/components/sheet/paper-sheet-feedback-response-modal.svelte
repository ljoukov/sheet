<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { MarkdownContent } from '../markdown/index.js';
	import PaperSheetFeedbackChat from './paper-sheet-feedback-chat.svelte';
	import type {
		PaperSheetComposerAttachmentDraft,
		PaperSheetFeedbackTurn,
		PaperSheetQuestionReview
	} from './types.js';

	let {
		questionLabel,
		questionPrompt,
		answerSummary,
		review,
		displayThread,
		processing = false,
		thinkingText = null,
		assistantDraftText = null,
		showAssistantDraft = false,
		showComposer = true,
		showFollowUpButton = false,
		resolvedFollowUpMode = false,
		draft,
		draftAttachments = [],
		draftAttachmentError = null,
		allowAttachments = false,
		allowTakePhoto = false,
		placeholder,
		composerDisabled = false,
		runtimeLocked = false,
		onClose,
		onRequestFollowUp = undefined,
		onAttachFiles = undefined,
		onRemoveDraftAttachment = undefined,
		onDraftChange,
		onReply
	}: {
		questionLabel: string;
		questionPrompt: string;
		answerSummary: string;
		review: PaperSheetQuestionReview;
		displayThread: PaperSheetFeedbackTurn[];
		processing?: boolean;
		thinkingText?: string | null;
		assistantDraftText?: string | null;
		showAssistantDraft?: boolean;
		showComposer?: boolean;
		showFollowUpButton?: boolean;
		resolvedFollowUpMode?: boolean;
		draft: string;
		draftAttachments?: PaperSheetComposerAttachmentDraft[];
		draftAttachmentError?: string | null;
		allowAttachments?: boolean;
		allowTakePhoto?: boolean;
		placeholder: string;
		composerDisabled?: boolean;
		runtimeLocked?: boolean;
		onClose: () => void;
		onRequestFollowUp?: () => void;
		onAttachFiles?: (files: File[]) => void | Promise<void>;
		onRemoveDraftAttachment?: (localId: string) => void;
		onDraftChange: (value: string) => void;
		onReply: (value?: string) => void;
	} = $props();

	const dialogTitleId = $derived(`paper-sheet-response-${questionLabel.replace(/\W+/g, '-')}`);
	const statusText = $derived.by(() => {
		if (processing || runtimeLocked) {
			return 'Spark is reviewing this response.';
		}
		if (showFollowUpButton) {
			return 'This response is resolved. Ask for another pass if something still feels unclear.';
		}
		if (resolvedFollowUpMode) {
			return 'Ask a focused follow-up about this problem.';
		}
		return 'Use the note to repair this answer, then send it for review.';
	});

	function handleBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	onMount(() => {
		document.body.classList.add('paper-sheet-response-modal-is-open');
		return () => {
			document.body.classList.remove('paper-sheet-response-modal-is-open');
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="paper-sheet-response-modal" role="presentation" onclick={handleBackdropClick}>
	<div
		class="paper-sheet-response-modal__dialog"
		role="dialog"
		aria-modal="true"
		aria-labelledby={dialogTitleId}
	>
		<header class="paper-sheet-response-modal__header">
			<div>
				<span>{questionLabel}</span>
				<h2 id={dialogTitleId}>Close the gap</h2>
				<p>{statusText}</p>
			</div>
			<button
				type="button"
				class="paper-sheet-response-modal__close"
				aria-label="Close response"
				onclick={onClose}
			>
				<XIcon aria-hidden="true" />
			</button>
		</header>

		<div class="paper-sheet-response-modal__body">
			<aside class="paper-sheet-response-modal__context" aria-label="Problem context">
				<section class="paper-sheet-response-modal__context-block">
					<span>Problem</span>
					<MarkdownContent markdown={questionPrompt} class="paper-sheet-response-modal__markdown" />
				</section>

				<section class="paper-sheet-response-modal__context-block">
					<span>Your answer</span>
					<MarkdownContent markdown={answerSummary} class="paper-sheet-response-modal__markdown" />
				</section>
			</aside>

			<section class="paper-sheet-response-modal__response" aria-label="Response thread">
				<div class="paper-sheet-response-modal__response-heading">
					<span>{review.label ?? 'Review note'}</span>
					<strong>Response</strong>
				</div>
				<PaperSheetFeedbackChat
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
					{composerDisabled}
					{runtimeLocked}
					{onRequestFollowUp}
					{onAttachFiles}
					{onRemoveDraftAttachment}
					{onDraftChange}
					{onReply}
				/>
			</section>
		</div>
	</div>
</div>

<style>
	.paper-sheet-response-modal {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: grid;
		place-items: center;
		overflow: auto;
		padding: 1.25rem;
		background: color-mix(in srgb, var(--paper-surface, #ffffff) 54%, transparent);
		backdrop-filter: blur(14px) saturate(1.08);
		-webkit-backdrop-filter: blur(14px) saturate(1.08);
		color: var(--paper-text, #241d19);
	}

	.paper-sheet-response-modal__dialog {
		--note-bg: var(--paper-review-incorrect-bg, #fbefe3);
		--note-left: var(--paper-review-incorrect-border, #c66317);
		--note-user-bg: var(--paper-lines-markdown-bg, #fdfdfd);
		--note-user-border: color-mix(
			in srgb,
			var(--note-left) 24%,
			var(--paper-border, rgba(33, 74, 58, 0.18))
		);
		--note-input-border: color-mix(in srgb, var(--note-left) 58%, var(--paper-surface, #ffffff));
		--note-text: var(--paper-text, #241d19);
		--note-text-muted: var(--paper-text-soft, rgba(87, 71, 58, 0.72));
		--note-composer-surface: color-mix(
			in srgb,
			var(--paper-surface-elevated, #ffffff) 94%,
			transparent
		);
		--note-composer-hover: color-mix(
			in srgb,
			var(--paper-text-soft, #555555) 10%,
			var(--paper-surface-elevated, #ffffff)
		);
		--note-status-processing: var(--paper-review-incorrect-text, #c66317);
		--chat-composer-radius: 8px;
		width: min(1240px, calc(100vw - 2.5rem));
		min-height: calc(100dvh - 2.5rem);
		max-height: calc(100dvh - 2.5rem);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--sheet-color, #36587a) 24%, transparent);
		border-radius: 8px;
		background: var(--paper-surface-elevated, #ffffff);
		box-shadow: 0 28px 90px -48px rgba(15, 23, 42, 0.58);
	}

	.paper-sheet-response-modal__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.35rem;
		background: var(--sheet-color, #36587a);
		color: #ffffff;
	}

	.paper-sheet-response-modal__header span {
		display: block;
		margin-bottom: 0.35rem;
		color: rgba(255, 255, 255, 0.74);
		font-size: 0.9rem;
		font-weight: 800;
	}

	.paper-sheet-response-modal__header h2 {
		margin: 0;
		font-size: 1.55rem;
		font-weight: 900;
		line-height: 1.14;
	}

	.paper-sheet-response-modal__header p {
		max-width: 58rem;
		margin: 0.45rem 0 0;
		color: rgba(255, 255, 255, 0.82);
		font-size: 0.98rem;
		line-height: 1.45;
	}

	.paper-sheet-response-modal__close {
		display: inline-flex;
		width: 2.25rem;
		height: 2.25rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(255, 255, 255, 0.26);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.12);
		color: #ffffff;
		cursor: pointer;
	}

	.paper-sheet-response-modal__close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.paper-sheet-response-modal__close:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.45);
		outline-offset: 2px;
	}

	.paper-sheet-response-modal__close :global(svg) {
		width: 1.15rem;
		height: 1.15rem;
	}

	.paper-sheet-response-modal__body {
		display: grid;
		grid-template-columns: minmax(15rem, 0.72fr) minmax(0, 1fr);
		gap: 1rem;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 1rem;
		background:
			linear-gradient(
				90deg,
				color-mix(in srgb, var(--sheet-color, #36587a) 9%, transparent) 0 1px,
				transparent 1px 100%
			),
			var(--paper-surface-soft, #f8f5f0);
		background-size: 2rem 2rem;
	}

	.paper-sheet-response-modal__context,
	.paper-sheet-response-modal__response {
		min-width: 0;
		min-height: 0;
		overflow: auto;
		border: 1px solid color-mix(in srgb, var(--sheet-color, #36587a) 18%, transparent);
		border-radius: 8px;
		background: color-mix(in srgb, var(--paper-surface-elevated, #ffffff) 94%, transparent);
	}

	.paper-sheet-response-modal__context {
		display: grid;
		align-content: start;
		gap: 0.85rem;
		padding: 1rem;
	}

	.paper-sheet-response-modal__context-block {
		min-width: 0;
	}

	.paper-sheet-response-modal__context-block span,
	.paper-sheet-response-modal__response-heading span {
		display: block;
		margin-bottom: 0.35rem;
		color: var(--sheet-color, #36587a);
		font-size: 0.78rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	:global(.paper-sheet-response-modal__markdown) {
		font-size: 0.96rem;
		line-height: 1.58;
		color: var(--paper-text, #241d19);
	}

	.paper-sheet-response-modal__response {
		padding: 1rem;
	}

	.paper-sheet-response-modal__response-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.7rem;
	}

	.paper-sheet-response-modal__response-heading span {
		margin-bottom: 0;
		color: var(--note-left);
	}

	.paper-sheet-response-modal__response-heading strong {
		color: var(--paper-text-soft, rgba(87, 71, 58, 0.72));
		font-size: 0.88rem;
		font-weight: 800;
	}

	:global(body.paper-sheet-response-modal-is-open) {
		overflow: hidden;
	}

	:global([data-theme='dark'] .paper-sheet-response-modal),
	:global(.dark .paper-sheet-response-modal) {
		background: rgba(6, 8, 16, 0.52);
	}

	@media (max-width: 760px) {
		.paper-sheet-response-modal {
			padding: 0;
			place-items: stretch;
		}

		.paper-sheet-response-modal__dialog {
			width: 100%;
			max-height: none;
			min-height: 100dvh;
			border-width: 0;
			border-radius: 0;
		}

		.paper-sheet-response-modal__header {
			padding: calc(env(safe-area-inset-top, 0px) + 1rem) 1rem 1rem;
		}

		.paper-sheet-response-modal__header h2 {
			font-size: 1.35rem;
		}

		.paper-sheet-response-modal__body {
			grid-template-columns: 1fr;
			gap: 0.8rem;
			padding: 0.8rem;
		}

		.paper-sheet-response-modal__context {
			gap: 0.7rem;
			padding: 0.85rem;
		}

		.paper-sheet-response-modal__response {
			padding: 0.85rem;
		}
	}
</style>
