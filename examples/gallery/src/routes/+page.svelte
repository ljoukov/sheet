<script lang="ts">
	import { resolve } from '$app/paths';
	import { galleryNavigation, worksheetEntries } from '$lib/gallery/data.js';
</script>

<div class="gallery-page">
	<header class="gallery-page__intro">
		<div class="gallery-page__eyebrow">Overview</div>
		<h1 class="gallery-page__title">
			Library routes for sheets, feedback, markdown, and surface cataloging.
		</h1>
		<p class="gallery-page__description">
			Use this app to inspect the exported package surfaces. The catalog route inventories the
			supported inputs and outputs, while the focused routes keep screenshots and regression checks
			repeatable.
		</p>
	</header>

	<section class="gallery-grid gallery-grid--two">
		<div class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Routes</p>
					<p class="gallery-stage__copy">
						Start with the full worksheet pages, then move to the focused component routes when you
						need tighter visual checks.
					</p>
				</div>
			</div>

			<div class="gallery-list">
				{#each galleryNavigation.slice(1) as item (item.href)}
					<a class="gallery-list__item" href={resolve(item.href)}>
						<div>
							<h2 class="gallery-list__item-title">{item.label}</h2>
							<p class="gallery-list__item-copy">{item.caption}</p>
						</div>
						<span class="gallery-pill">Route</span>
					</a>
				{/each}
			</div>
		</div>

		<div class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Seeded documents</p>
					<p class="gallery-stage__copy">
						Sample worksheets with different question densities, content mixes, and seeded review
						data.
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
		</div>
	</section>
</div>
