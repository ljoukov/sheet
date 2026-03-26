<script lang="ts">
	import { Markdown } from '@ljoukov/sheet';

	const blockMarkdown = `
# Worked example

The remainder is **43**, so we know:

$$
2023 - 43 = 1980
$$

That means \`n\` must divide \`1980\`.

## Strategy

1. Factorise \`1980\`
2. List factors greater than 43
3. Check that each factor gives remainder 43

> The cleanest final sentence is the one that repeats the corrected count.

\`\`\`ts
const factors = [44, 45, 55, 60, 66];
console.log(factors.length);
\`\`\`
`;

	const inlineMarkdown =
		'Inline maths like `$F = ma$` and code like `const x = 19` should stay readable.';
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
				<Markdown markdown={blockMarkdown} />
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
						<Markdown markdown={inlineMarkdown} inline={true} />
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
