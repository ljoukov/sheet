<script lang="ts">
	import { page } from '$app/state';
	import { Sheet } from '@ljoukov/sheet';
	import { getQuestionDemo, type QuestionKind } from '$lib/gallery/data.js';

	let { data }: { data: { kind: string } } = $props();

	const theme = $derived(page.url.searchParams.get('theme') === 'dark' ? 'dark' : 'light');
	const demo = $derived(getQuestionDemo(data.kind as QuestionKind));
</script>

{#if demo}
	<div
		class={`gallery-render theme-${theme}`}
		data-component-root
		data-component="question"
		data-render-ready="true"
		data-state={data.kind}
		data-theme={theme}
	>
		<div
			class="gallery-render__panel gallery-render__panel--question"
			data-screenshot-target="question"
		>
			{#key demo.sheet.id}
				<Sheet
					document={demo.sheet}
					seedAnswers={demo.seedAnswers}
					mode="demo"
					allowReplies={true}
				/>
			{/key}
		</div>
	</div>
{/if}
