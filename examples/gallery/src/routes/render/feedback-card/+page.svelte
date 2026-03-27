<script lang="ts">
	import { page } from '$app/state';
	import { SheetFeedbackCard } from '@ljoukov/sheet';
	import {
		defaultFeedbackCardState,
		feedbackCardStates,
		type FeedbackCardState
	} from '$lib/gallery/component-demos.js';

	const theme = $derived(page.url.searchParams.get('theme') === 'dark' ? 'dark' : 'light');
	const requestedVariant = $derived(page.url.searchParams.get('state') ?? defaultFeedbackCardState);
	const variant = $derived(
		requestedVariant in feedbackCardStates
			? (requestedVariant as FeedbackCardState)
			: defaultFeedbackCardState
	);
	const card = $derived(feedbackCardStates[variant]);

	let draft = $state('');

	$effect(() => {
		if (variant) {
			draft = '';
		}
	});
</script>

<div
	class={`gallery-render theme-${theme}`}
	data-component-root
	data-component="feedback-card"
	data-render-ready="true"
	data-state={variant}
	data-theme={theme}
>
	<div
		class="gallery-render__panel gallery-render__panel--card"
		data-screenshot-target="feedback-card"
	>
		<SheetFeedbackCard
			review={card.review}
			questionLabel="question demo"
			{draft}
			thread={card.thread}
			processing={card.processing ?? false}
			runtimeStatus={card.runtimeStatus ?? null}
			thinkingText={card.thinkingText ?? null}
			assistantDraftText={card.assistantDraftText ?? null}
			showComposer={!card.showFollowUpButton}
			showFollowUpButton={card.showFollowUpButton ?? false}
			onDraftChange={(value) => {
				draft = value;
			}}
		/>
	</div>
</div>
