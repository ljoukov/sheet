<script lang="ts">
	import { SheetFeedbackThread } from '@ljoukov/sheet';
	import { feedbackThreadStates } from '$lib/gallery/component-demos.js';

	let draft = $state('');
</script>

<div class="gallery-page">
	<header class="gallery-page__intro">
		<div class="gallery-page__eyebrow">Feedback thread</div>
		<h1 class="gallery-page__title">Reply thread layout and streaming response states.</h1>
		<p class="gallery-page__description">
			This route isolates the thread surface so composer, attachments, and response streaming are
			easy to inspect.
		</p>
	</header>

	<section class="gallery-grid gallery-grid--two">
		<div class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Open thread</p>
					<p class="gallery-stage__copy">
						Student and tutor turns rendered without the surrounding review card.
					</p>
				</div>
			</div>

			<div class="gallery-frame">
				<SheetFeedbackThread
					thread={feedbackThreadStates.open.thread}
					{draft}
					questionLabel="divisor count"
					onDraftChange={(value) => {
						draft = value;
					}}
				/>
			</div>
		</div>

		<div class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">Response stream</p>
					<p class="gallery-stage__copy">
						The same component with runtime text and the in-progress tutor response.
					</p>
				</div>
			</div>

			<div class="gallery-frame">
				<SheetFeedbackThread
					thread={feedbackThreadStates.responding.thread}
					draft=""
					questionLabel="divisor count"
					thinkingText={feedbackThreadStates.responding.thinkingText}
					assistantDraftText={feedbackThreadStates.responding.assistantDraftText}
				/>
			</div>
		</div>
	</section>
</div>
