<script lang="ts">
	import { Sheet } from '@ljoukov/sheet';
	import { getQuestionDemo, type QuestionKind } from '$lib/gallery/data.js';

	let { data }: { data: { kind: string } } = $props();

	const demo = $derived(getQuestionDemo(data.kind as QuestionKind));
</script>

{#if demo}
	<div class="gallery-page gallery-page--wide">
		<header class="gallery-page__intro">
			<div class="gallery-page__eyebrow">Question demo</div>
			<h1 class="gallery-page__title">{demo.label}</h1>
			<p class="gallery-page__description">{demo.description}</p>
		</header>

		<section class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Focused sheet crop</p>
					<p class="gallery-stage__copy">
						Single-question document built from a seeded sample so spacing and note placement stay
						realistic.
					</p>
				</div>
			</div>

			<div class="gallery-canvas gallery-canvas--sheet">
				{#key demo.sheet.id}
					<Sheet
						document={demo.sheet}
						seedAnswers={demo.seedAnswers}
						mode="demo"
						allowReplies={true}
					/>
				{/key}
			</div>
		</section>
	</div>
{/if}
