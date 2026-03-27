<script lang="ts">
	import { Markdown } from '@ljoukov/sheet';
	import { markdownStates } from '$lib/gallery/component-demos.js';
</script>

<div class="gallery-page">
	<header class="gallery-page__intro">
		<div class="gallery-page__eyebrow">Markdown</div>
		<h1 class="gallery-page__title">Markdown renderer for text, maths, and code.</h1>
		<p class="gallery-page__description">
			The same renderer is shared by worksheet content, tutor replies, and longer written answers.
		</p>
	</header>

	<section class="gallery-grid gallery-grid--two">
		<div class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Block markdown</p>
					<p class="gallery-stage__copy">
						Headings, lists, block quotes, KaTeX maths, and syntax-highlighted code.
					</p>
				</div>
			</div>
			<div class="gallery-frame">
				<Markdown markdown={markdownStates.block.markdown} />
			</div>
		</div>

		<div class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Inline markdown</p>
					<p class="gallery-stage__copy">
						Inline rendering for compact badges, prompts, or caption text.
					</p>
				</div>
			</div>
			<div class="gallery-frame">
				<div class="gallery-inline-preview">
					<div class="gallery-inline-chip">
						<Markdown markdown={markdownStates.inline.markdown} inline={true} />
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
