<script lang="ts">
	const packageFeatures = [
		'Paper-style worksheet rendering',
		'Question-level review notes and reply threads',
		'Markdown with maths and code formatting'
	];
</script>

<svelte:head>
	<title>@ljoukov/sheet</title>
	<meta
		name="description"
		content="Svelte components for paper-style worksheets, review notes, and tutoring threads."
	/>
</svelte:head>

<main class="package-home">
	<div class="package-home__frame">
		<p class="package-home__eyebrow">Svelte Library</p>
		<h1 class="package-home__title">@ljoukov/sheet</h1>
		<p class="package-home__copy">
			Reusable worksheet surfaces for assessment flows, reviewed answers, and inline tutor feedback.
		</p>

		<ul class="package-home__list">
			{#each packageFeatures as feature (feature)}
				<li>{feature}</li>
			{/each}
		</ul>

		<p class="package-home__hint">
			Use the gallery app in <code>examples/gallery</code> for live demos, including isolated
			<code>/render/*</code> routes for screenshot capture.
		</p>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', system-ui, sans-serif;
		background: #fafafa;
		color: #18181b;
	}

	.package-home {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.package-home__frame {
		width: min(42rem, 100%);
		padding: 2rem;
		border: 1px solid #e4e4e7;
		border-radius: 1rem;
		background: #ffffff;
		box-shadow: 0 1px 2px rgba(24, 24, 27, 0.06);
	}

	.package-home__eyebrow {
		margin: 0 0 0.5rem;
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.5rem;
		border: 1px solid #e4e4e7;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #52525b;
	}

	.package-home__title {
		margin: 0.85rem 0 0;
		font-size: clamp(2.2rem, 4vw, 3.5rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.package-home__copy {
		margin: 1rem 0 0;
		max-width: 34rem;
		font-size: 1.05rem;
		line-height: 1.6;
		color: #52525b;
	}

	.package-home__list {
		margin: 1.5rem 0 0;
		padding-left: 1.2rem;
		display: grid;
		gap: 0.65rem;
		color: #27272a;
	}

	.package-home__hint {
		margin: 1.5rem 0 0;
		font-size: 0.95rem;
		color: #71717a;
	}

	.package-home__hint code {
		padding: 0.15rem 0.35rem;
		border-radius: 0.35rem;
		background: #f4f4f5;
		font-size: 0.9em;
	}
</style>
