<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type ChatInputVariant = 'default' | 'chat';
	type SubmitMode = 'modEnter' | 'enter';

	type Props = {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		maxLines?: number;
		maxChars?: number;
		ariaLabel?: string;
		autocomplete?: HTMLTextareaAttributes['autocomplete'];
		spellcheck?: boolean;
		inputClass?: string;
		variant?: ChatInputVariant;
		submitMode?: SubmitMode;
		onInput?: (detail: { value: string; isExpanded?: boolean }) => void;
		onLayoutChange?: (detail: { value: string; isExpanded: boolean }) => void;
		onSubmit?: (detail: { value: string }) => void;
		onPaste?: (event: ClipboardEvent) => void;
	};

	let {
		value = $bindable(''),
		placeholder = 'Type your message',
		disabled = false,
		maxLines = 7,
		maxChars = 1_000,
		ariaLabel = 'Message',
		autocomplete = 'off',
		spellcheck = false,
		inputClass = '',
		variant = 'default',
		submitMode = 'modEnter',
		onInput = undefined,
		onLayoutChange = undefined,
		onSubmit = undefined,
		onPaste = undefined
	}: Props = $props();

	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let hasExpanded = $state(false);

	function resolveBaseClass(currentVariant: ChatInputVariant): string {
		if (currentVariant === 'chat') {
			return ['chat-input', 'chat-input--chat'].join(' ');
		}

		return ['chat-input', 'chat-input--default'].join(' ');
	}

	function resizeTextarea(): void {
		if (!textareaEl) {
			return;
		}

		textareaEl.style.height = 'auto';

		const style = getComputedStyle(textareaEl);
		const lineHeight = Number.parseFloat(style.lineHeight) || 20;
		const paddingTop = Number.parseFloat(style.paddingTop) || 0;
		const paddingBottom = Number.parseFloat(style.paddingBottom) || 0;
		const hasValue = value.length > 0;
		const wantsExtraLine = variant === 'chat' && value.includes('\n');
		const singleHeight = lineHeight + paddingTop + paddingBottom;
		const hasVisualOverflow = textareaEl.scrollHeight > singleHeight + 1;

		hasExpanded = hasValue && (wantsExtraLine || hasVisualOverflow);

		const isExpanded = hasValue && (hasExpanded || wantsExtraLine);
		const baseMinLines = wantsExtraLine ? 3 : hasExpanded ? 2 : 1;
		const minLines = Math.min(maxLines, baseMinLines);
		const minHeight = lineHeight * minLines + paddingTop + paddingBottom;
		const maxHeight = lineHeight * maxLines + paddingTop + paddingBottom;
		const nextHeight = Math.min(Math.max(textareaEl.scrollHeight, minHeight), maxHeight);

		textareaEl.style.height = `${nextHeight}px`;
		textareaEl.style.overflowY = textareaEl.scrollHeight > maxHeight ? 'auto' : 'hidden';
		textareaEl.dataset.expanded = isExpanded ? 'true' : 'false';

		onLayoutChange?.({ value, isExpanded });
	}

	function handleInput(event: Event): void {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		resizeTextarea();
		const isExpanded = target.dataset.expanded === 'true';
		onInput?.({ value, isExpanded });
	}

	function handleKeyDown(event: KeyboardEvent): void {
		if (event.key !== 'Enter' || event.isComposing) {
			return;
		}

		if (submitMode === 'enter') {
			if (event.shiftKey) {
				return;
			}

			event.preventDefault();
			const trimmed = value.trim();
			if (!trimmed) {
				return;
			}

			onSubmit?.({ value: trimmed });
			return;
		}

		if (event.metaKey || event.ctrlKey) {
			event.preventDefault();
			const trimmed = value.trim();
			if (!trimmed) {
				return;
			}

			onSubmit?.({ value: trimmed });
		}
	}

	function handlePaste(event: ClipboardEvent): void {
		onPaste?.(event);
	}

	$effect(() => {
		void value;
		resizeTextarea();
	});

	$effect(() => {
		if (!textareaEl || typeof ResizeObserver === 'undefined') {
			return;
		}

		const observedTarget = textareaEl.parentElement ?? textareaEl;
		let frameId = 0;

		const scheduleResize = (): void => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}

			frameId = requestAnimationFrame(() => {
				frameId = 0;
				resizeTextarea();
			});
		};

		const observer = new ResizeObserver(() => {
			scheduleResize();
		});

		observer.observe(observedTarget);

		return () => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}
			observer.disconnect();
		};
	});
</script>

<textarea
	class={`${resolveBaseClass(variant)} ${inputClass}`.trim()}
	bind:this={textareaEl}
	bind:value
	oninput={handleInput}
	onkeydown={handleKeyDown}
	onpaste={handlePaste}
	{disabled}
	{autocomplete}
	{spellcheck}
	rows={1}
	maxlength={maxChars}
	aria-label={ariaLabel}
	{placeholder}
></textarea>

<style>
	.chat-input {
		font-family: inherit;
		outline: none;
	}

	.chat-input--chat {
		min-height: 0;
		width: 100%;
		resize: none;
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: 0;
		font-size: 0.95rem;
		line-height: 1.5rem;
		color: inherit;
		box-shadow: none;
	}

	.chat-input--chat::placeholder {
		color: rgba(100, 116, 139, 0.72);
	}

	.chat-input--default {
		min-height: 2.75rem;
		width: 100%;
		resize: none;
		border: 2px solid rgba(148, 163, 184, 0.3);
		border-radius: 1rem;
		background: #ffffff;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		line-height: 1.5rem;
		box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
		transition: border-color 0.2s ease;
	}
</style>
