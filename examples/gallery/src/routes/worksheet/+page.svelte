<script lang="ts">
	import { resolve } from '$app/paths';
	import { worksheetEntries } from '$lib/gallery/data.js';
</script>

<div class="gallery-page">
	<header class="gallery-page__intro">
		<div class="gallery-page__eyebrow">Worksheets</div>
		<h1 class="gallery-page__title">Whole-sheet routes with seeded answers and review data.</h1>
		<p class="gallery-page__description">
			Each sample lives on its own route so screenshot captures stay stable. These pages render the
			published package API directly.
		</p>
	</header>

	<section class="gallery-stage">
		<div class="gallery-stage__header">
			<div>
				<p class="gallery-stage__title">Samples</p>
				<p class="gallery-stage__copy">
					Every route reuses the same `Sheet` component with a different seeded document.
				</p>
			</div>
		</div>

		<div class="gallery-list">
			{#each worksheetEntries as entry (entry.id)}
				<a class="gallery-list__item" href={resolve('/worksheet/[id]', { id: entry.id })}>
					<div>
						<h2 class="gallery-list__item-title">{entry.subject} · {entry.title}</h2>
						<p class="gallery-list__item-copy">{entry.level} · {entry.subtitle}</p>
					</div>
					<span class="gallery-pill">Open</span>
				</a>
			{/each}
		</div>
	</section>
</div>
