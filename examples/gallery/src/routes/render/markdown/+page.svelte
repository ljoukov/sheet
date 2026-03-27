<script lang="ts">
	import { page } from '$app/state';
	import { Markdown } from '@ljoukov/sheet';
	import {
		defaultMarkdownState,
		markdownStates,
		type MarkdownState
	} from '$lib/gallery/component-demos.js';

	const theme = $derived(page.url.searchParams.get('theme') === 'dark' ? 'dark' : 'light');
	const requestedVariant = $derived(page.url.searchParams.get('state') ?? defaultMarkdownState);
	const variant = $derived(
		requestedVariant in markdownStates ? (requestedVariant as MarkdownState) : defaultMarkdownState
	);
	const demo = $derived(markdownStates[variant]);
</script>

<div
	class={`gallery-render theme-${theme}`}
	data-component-root
	data-component="markdown"
	data-render-ready="true"
	data-state={variant}
	data-theme={theme}
>
	<div
		class="gallery-render__panel gallery-render__panel--markdown"
		data-screenshot-target="markdown"
	>
		<div class={`gallery-render__markdown-surface ${demo.inline ? 'is-inline' : ''}`}>
			<Markdown markdown={demo.markdown} inline={demo.inline ?? false} />
		</div>
	</div>
</div>
