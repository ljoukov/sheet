<script lang="ts">
	import { page } from '$app/state';
	import { Sheet } from '@ljoukov/sheet';
	import { getWorksheetById } from '$lib/gallery/data.js';
	import { defaultSheetState } from '$lib/gallery/component-demos.js';

	const theme = $derived(page.url.searchParams.get('theme') === 'dark' ? 'dark' : 'light');
	const requestedVariant = $derived(page.url.searchParams.get('state') ?? defaultSheetState);
	const variant = $derived(
		getWorksheetById(requestedVariant) ? requestedVariant : defaultSheetState
	);
	const sample = $derived(getWorksheetById(variant) ?? getWorksheetById(defaultSheetState));
</script>

{#if sample}
	<div
		class={`gallery-render theme-${theme}`}
		data-component-root
		data-component="sheet"
		data-render-ready="true"
		data-state={variant}
		data-theme={theme}
	>
		<div class="gallery-render__panel gallery-render__panel--sheet" data-screenshot-target="sheet">
			<Sheet
				document={sample.document}
				seedAnswers={sample.seedAnswers}
				mockReview={sample.mockReview}
				mode="demo"
				allowReplies={true}
			/>
		</div>
	</div>
{/if}
