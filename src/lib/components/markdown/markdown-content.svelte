<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { renderMarkdown, renderMarkdownInline } from '../../markdown.js';

	async function copyText(value: string): Promise<boolean> {
		if (!BROWSER) {
			return false;
		}
		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(value);
				return true;
			} catch {
				// Fall back to document.execCommand below.
			}
		}
		try {
			const textarea = document.createElement('textarea');
			textarea.value = value;
			textarea.setAttribute('readonly', 'true');
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			textarea.style.pointerEvents = 'none';
			document.body.appendChild(textarea);
			textarea.select();
			const ok = document.execCommand('copy');
			textarea.remove();
			return ok;
		} catch {
			return false;
		}
	}

	const copyResetTimers = new WeakMap<HTMLButtonElement, number>();

	function setCopyButtonState(
		button: HTMLButtonElement,
		state: 'idle' | 'copied' | 'error' | 'empty',
		label: string
	): void {
		button.setAttribute('aria-label', label);
		if (state === 'idle') {
			delete button.dataset.copyState;
		} else {
			button.dataset.copyState = state;
		}
		const existingTimer = copyResetTimers.get(button);
		if (existingTimer !== undefined) {
			window.clearTimeout(existingTimer);
		}
		const timeoutId = window.setTimeout(() => {
			button.setAttribute('aria-label', 'Copy code');
			delete button.dataset.copyState;
		}, 1400);
		copyResetTimers.set(button, timeoutId);
	}

	async function handleCodeCopyClick(event: MouseEvent): Promise<void> {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>('[data-code-copy]');
		if (!button) {
			return;
		}
		event.preventDefault();
		const codeEl = button.closest('.code-block')?.querySelector('code');
		const code = codeEl?.textContent ?? '';
		if (!code) {
			setCopyButtonState(button, 'empty', 'No code');
			return;
		}
		const ok = await copyText(code);
		setCopyButtonState(button, ok ? 'copied' : 'error', ok ? 'Copied' : 'Copy failed');
	}

	let {
		markdown,
		inline = false,
		class: className = undefined
	}: {
		markdown: string;
		inline?: boolean;
		class?: string;
	} = $props();

	const renderedHtml = $derived.by(() => {
		const trimmed = markdown.trim();
		if (trimmed.length === 0) {
			return '';
		}
		return inline ? renderMarkdownInline(markdown) : renderMarkdown(markdown);
	});

	const rootClass = $derived(
		['markdown-content', inline ? 'is-inline' : null, className].filter(Boolean).join(' ')
	);
	let rootElement = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!BROWSER || !rootElement) {
			return;
		}
		const element = rootElement;
		element.addEventListener('click', handleCodeCopyClick);
		return () => {
			element.removeEventListener('click', handleCodeCopyClick);
		};
	});
</script>

{#if inline}
	<span bind:this={rootElement} class={rootClass}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html renderedHtml}
	</span>
{:else}
	<div bind:this={rootElement} class={rootClass}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html renderedHtml}
	</div>
{/if}

<style>
	.markdown-content {
		color: var(--markdown-text, inherit);
		font-size: inherit;
		line-height: inherit;
		--markdown-inline-code-bg-default: #eef2f7;
		--markdown-inline-code-text-default: #1f2937;
		--markdown-code-bg-default: #f8fafc;
		--markdown-code-header-bg-default: #eef2f7;
		--markdown-code-border-default: rgba(148, 163, 184, 0.35);
		--markdown-code-text-default: #0f172a;
		--markdown-code-muted-default: #64748b;
		--markdown-code-keyword-default: #7c3aed;
		--markdown-code-string-default: #047857;
		--markdown-code-number-default: #b45309;
		--markdown-code-function-default: #2563eb;
		--markdown-code-type-default: #be185d;
		--markdown-figure-bg-default: #fcfcfd;
		--markdown-figure-border-default: rgba(148, 163, 184, 0.28);
		--markdown-figure-shadow-default: 0 20px 32px -28px rgba(15, 23, 42, 0.28);
		--markdown-figure-caption-default: #64748b;
		--markdown-figure-link-badge-bg-default: rgba(255, 255, 255, 0.9);
		--markdown-figure-link-badge-border-default: rgba(148, 163, 184, 0.3);
	}

	.markdown-content.is-inline {
		display: inline;
	}

	:global([data-theme='dark'] .markdown-content),
	:global(:root:not([data-theme='light']) .markdown-content),
	:global(.dark .markdown-content) {
		--markdown-inline-code-bg-default: color-mix(in srgb, currentColor 12%, transparent);
		--markdown-inline-code-text-default: currentColor;
		--markdown-code-bg-default: #0f172a;
		--markdown-code-header-bg-default: #162033;
		--markdown-code-border-default: #273449;
		--markdown-code-text-default: #e2e8f0;
		--markdown-code-muted-default: #94a3b8;
		--markdown-code-keyword-default: #c084fc;
		--markdown-code-string-default: #34d399;
		--markdown-code-number-default: #fbbf24;
		--markdown-code-function-default: #60a5fa;
		--markdown-code-type-default: #f472b6;
		--markdown-figure-bg-default: #141f33;
		--markdown-figure-border-default: rgba(100, 116, 139, 0.4);
		--markdown-figure-shadow-default: 0 24px 40px -30px rgba(2, 6, 23, 0.72);
		--markdown-figure-caption-default: #94a3b8;
		--markdown-figure-link-badge-bg-default: rgba(15, 23, 42, 0.86);
		--markdown-figure-link-badge-border-default: rgba(100, 116, 139, 0.42);
	}

	:global(.markdown-content > * + *) {
		margin-top: 0.75rem;
	}

	:global(.markdown-content h1),
	:global(.markdown-content h2),
	:global(.markdown-content h3),
	:global(.markdown-content h4) {
		margin-top: 1rem;
		margin-bottom: 0.4rem;
		font-size: 1.05em;
		font-weight: 600;
		line-height: 1.35;
		color: var(--markdown-heading, var(--markdown-text, inherit));
	}

	:global(.markdown-content p) {
		margin: 0;
	}

	:global(.markdown-content ul),
	:global(.markdown-content ol) {
		margin: 0;
		padding-left: 1.25rem;
		list-style-position: outside;
	}

	:global(.markdown-content ul) {
		list-style-type: disc;
	}

	:global(.markdown-content ol) {
		list-style-type: decimal;
	}

	:global(.markdown-content li + li) {
		margin-top: 0.3rem;
	}

	:global(.markdown-content a) {
		color: var(--markdown-link, currentColor);
		text-decoration: underline;
		text-underline-offset: 0.16em;
	}

	:global(.markdown-content a.markdown-link) {
		word-break: break-word;
	}

	:global(.markdown-content .markdown-figure) {
		display: block;
		width: min(100%, 44rem);
		max-width: 100%;
		margin: 0.95rem 0;
		padding: 0.8rem;
		box-sizing: border-box;
		border: 1px solid var(--markdown-figure-border, var(--markdown-figure-border-default));
		border-radius: 1rem;
		background: var(--markdown-figure-bg, var(--markdown-figure-bg-default));
		box-shadow: var(--markdown-figure-shadow, var(--markdown-figure-shadow-default));
	}

	:global(.markdown-content .markdown-figure__image) {
		display: block;
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 0.75rem;
		background: color-mix(in srgb, currentColor 4%, transparent);
		transition: transform 0.18s ease;
	}

	:global(.markdown-content .markdown-figure__caption) {
		display: block;
		margin-top: 0.6rem;
		font-size: 0.82em;
		line-height: 1.45;
		color: var(--markdown-figure-caption, var(--markdown-figure-caption-default));
	}

	:global(.markdown-content a.markdown-figure-link) {
		position: relative;
		display: block;
		width: fit-content;
		max-width: 100%;
		text-decoration: none;
		color: inherit;
	}

	:global(.markdown-content a.markdown-figure-link::after) {
		content: 'Open image';
		position: absolute;
		top: 1rem;
		right: 1rem;
		padding: 0.28rem 0.6rem;
		border: 1px solid
			var(--markdown-figure-link-badge-border, var(--markdown-figure-link-badge-border-default));
		border-radius: 999px;
		background: var(--markdown-figure-link-badge-bg, var(--markdown-figure-link-badge-bg-default));
		color: var(--markdown-link, currentColor);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		pointer-events: none;
	}

	:global(.markdown-content a.markdown-figure-link:hover .markdown-figure),
	:global(.markdown-content a.markdown-figure-link:focus-visible .markdown-figure) {
		border-color: color-mix(in srgb, var(--markdown-link, currentColor) 48%, transparent);
		box-shadow: 0 24px 36px -28px rgba(15, 23, 42, 0.34);
	}

	:global(.markdown-content a.markdown-figure-link:hover .markdown-figure__image),
	:global(.markdown-content a.markdown-figure-link:focus-visible .markdown-figure__image) {
		transform: scale(1.01);
	}

	:global(.markdown-content strong) {
		color: var(--markdown-strong, currentColor);
		font-weight: 700;
	}

	:global(.markdown-content em) {
		font-style: italic;
	}

	:global(.markdown-content blockquote) {
		margin: 0;
		padding-left: 0.9rem;
		border-left: 3px solid
			var(--markdown-quote-border, color-mix(in srgb, currentColor 18%, transparent));
		color: var(--markdown-quote-text, color-mix(in srgb, currentColor 78%, transparent));
	}

	:global(.markdown-content table) {
		width: 100%;
		border-collapse: collapse;
		border-radius: 0.85rem;
		overflow: hidden;
		border: 1px solid
			var(--markdown-table-border, color-mix(in srgb, currentColor 16%, transparent));
		font-size: 0.92em;
	}

	:global(.markdown-content thead) {
		background: var(--markdown-table-head-bg, color-mix(in srgb, currentColor 8%, transparent));
	}

	:global(.markdown-content th),
	:global(.markdown-content td) {
		padding: 0.55rem 0.65rem;
		text-align: left;
		border-bottom: 1px solid
			var(--markdown-table-border, color-mix(in srgb, currentColor 16%, transparent));
	}

	:global(.markdown-content tbody tr:last-child td) {
		border-bottom: none;
	}

	:global(.markdown-content :not(pre) > code) {
		padding: 0.1rem 0.3rem;
		border-radius: 0.3rem;
		background: var(--markdown-inline-code-bg, var(--markdown-inline-code-bg-default));
		color: var(--markdown-inline-code-text, var(--markdown-inline-code-text-default));
		font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 0.85em;
	}

	:global(.markdown-content .katex-display) {
		margin: 0.85rem 0;
		overflow-x: auto;
		overflow-y: hidden;
	}

	:global(.markdown-content .code-block) {
		margin: 0.85rem 0;
		overflow: hidden;
		border: 1px solid var(--markdown-code-border, var(--markdown-code-border-default));
		border-radius: 0.75rem;
		background: var(--markdown-code-bg, var(--markdown-code-bg-default));
		box-shadow: 0 16px 30px -28px rgba(15, 23, 42, 0.25);
	}

	:global(.markdown-content .code-block__header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.45rem 0.75rem;
		border-bottom: 1px solid var(--markdown-code-border, var(--markdown-code-border-default));
		background: var(--markdown-code-header-bg, var(--markdown-code-header-bg-default));
		font-size: 0.7rem;
		letter-spacing: 0.01em;
		text-transform: lowercase;
	}

	:global(.markdown-content .code-block__lang) {
		font-weight: 600;
		color: var(--markdown-code-muted, var(--markdown-code-muted-default));
	}

	:global(.markdown-content .code-block__copy) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border: 1px solid transparent;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--markdown-code-muted, var(--markdown-code-muted-default));
		cursor: pointer;
		transition:
			color 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
	}

	:global(.markdown-content .code-block__copy:hover) {
		color: var(--markdown-code-text, var(--markdown-code-text-default));
		border-color: var(--markdown-code-border, var(--markdown-code-border-default));
		background: color-mix(
			in srgb,
			var(--markdown-code-border, var(--markdown-code-border-default)) 55%,
			transparent
		);
	}

	:global(.markdown-content .code-block__copy-icon) {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
	}

	:global(.markdown-content .code-block__copy[data-copy-state='copied']) {
		color: var(--markdown-code-string, var(--markdown-code-string-default));
	}

	:global(.markdown-content .code-block__copy[data-copy-state='error']) {
		color: #ef4444;
	}

	:global(.markdown-content .code-block pre) {
		margin: 0;
		padding: 0.85rem 0.9rem 0.95rem;
		overflow-x: auto;
		background: transparent;
	}

	:global(.markdown-content .code-block pre code) {
		display: block;
		padding: 0;
		color: var(--markdown-code-text, var(--markdown-code-text-default));
		font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 0.85rem;
	}

	:global(.markdown-content .hljs-comment),
	:global(.markdown-content .hljs-quote) {
		color: var(--markdown-code-muted, var(--markdown-code-muted-default));
		font-style: italic;
	}

	:global(.markdown-content .hljs-keyword),
	:global(.markdown-content .hljs-selector-tag),
	:global(.markdown-content .hljs-literal) {
		color: var(--markdown-code-keyword, var(--markdown-code-keyword-default));
		font-weight: 600;
	}

	:global(.markdown-content .hljs-string),
	:global(.markdown-content .hljs-symbol),
	:global(.markdown-content .hljs-template-tag) {
		color: var(--markdown-code-string, var(--markdown-code-string-default));
	}

	:global(.markdown-content .hljs-number),
	:global(.markdown-content .hljs-regexp),
	:global(.markdown-content .hljs-attr) {
		color: var(--markdown-code-number, var(--markdown-code-number-default));
	}

	:global(.markdown-content .hljs-title),
	:global(.markdown-content .hljs-function) {
		color: var(--markdown-code-function, var(--markdown-code-function-default));
	}

	:global(.markdown-content .hljs-type),
	:global(.markdown-content .hljs-built_in),
	:global(.markdown-content .hljs-class) {
		color: var(--markdown-code-type, var(--markdown-code-type-default));
	}
</style>
