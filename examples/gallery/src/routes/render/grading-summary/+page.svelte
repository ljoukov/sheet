<script lang="ts">
	import { page } from '$app/state';
	import { Sheet } from '@ljoukov/sheet';
	import { getWorksheetById } from '$lib/gallery/data.js';

	const theme = $derived(page.url.searchParams.get('theme') === 'dark' ? 'dark' : 'light');
	const sample = $derived(getWorksheetById('hamilton-2023'));
</script>

{#if sample}
	<div
		class={`gallery-render theme-${theme}`}
		data-component-root
		data-component="grading-summary"
		data-render-ready="true"
		data-theme={theme}
	>
		<div class="gallery-render__panel gallery-render__panel--summary">
			<Sheet
				document={sample.document}
				seedAnswers={sample.seedAnswers}
				review={sample.mockReview ?? undefined}
				mode="review"
			/>
		</div>
	</div>
{/if}
