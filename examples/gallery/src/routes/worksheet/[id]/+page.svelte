<script lang="ts">
	import { Sheet } from '@ljoukov/sheet';
	import { getWorksheetById } from '$lib/gallery/data.js';

	let { data }: { data: { id: string } } = $props();

	const sample = $derived(getWorksheetById(data.id));
</script>

{#if sample}
	<div class="gallery-page gallery-page--wide">
		<header class="gallery-page__intro">
			<div class="gallery-page__eyebrow">{sample.document.subject} worksheet</div>
			<h1 class="gallery-page__title">{sample.document.title}</h1>
			<p class="gallery-page__description">
				{sample.document.level} · {sample.document.subtitle}. This route is intended for whole-sheet
				screenshots and visual QA passes.
			</p>
		</header>

		<section class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Whole sheet surface</p>
					<p class="gallery-stage__copy">
						The gallery seeds the sample answers and enables demo review mode so the entire surface
						is visible without extra app wiring.
					</p>
				</div>
			</div>

			<div class="gallery-canvas gallery-canvas--sheet">
				<Sheet
					document={sample.document}
					seedAnswers={sample.seedAnswers}
					mockReview={sample.mockReview}
					mode="demo"
					allowReplies={true}
				/>
			</div>
		</section>
	</div>
{/if}
