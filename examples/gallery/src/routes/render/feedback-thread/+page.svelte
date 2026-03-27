<script lang="ts">
	import { page } from '$app/state';
	import { SheetFeedbackThread } from '@ljoukov/sheet';
	import {
		defaultFeedbackThreadState,
		feedbackThreadStates,
		type FeedbackThreadState
	} from '$lib/gallery/component-demos.js';

	const theme = $derived(page.url.searchParams.get('theme') === 'dark' ? 'dark' : 'light');
	const requestedVariant = $derived(
		page.url.searchParams.get('state') ?? defaultFeedbackThreadState
	);
	const variant = $derived(
		requestedVariant in feedbackThreadStates
			? (requestedVariant as FeedbackThreadState)
			: defaultFeedbackThreadState
	);
	const demo = $derived(feedbackThreadStates[variant]);
	const thinkingText = $derived(demo.thinkingText);
	const assistantDraftText = $derived(demo.assistantDraftText);

	let draft = $state('');

	$effect(() => {
		if (demo) {
			draft = demo.draft;
		}
	});
</script>

<div
	class={`gallery-render theme-${theme}`}
	data-component-root
	data-component="feedback-thread"
	data-render-ready="true"
	data-state={variant}
	data-theme={theme}
>
	<div
		class="gallery-render__panel gallery-render__panel--thread"
		data-screenshot-target="feedback-thread"
	>
		<SheetFeedbackThread
			thread={demo.thread}
			questionLabel="divisor count"
			{draft}
			{thinkingText}
			{assistantDraftText}
			onDraftChange={(value) => {
				draft = value;
			}}
		/>
	</div>
</div>
