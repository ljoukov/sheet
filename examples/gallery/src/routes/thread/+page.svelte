<script lang="ts">
	import { SheetFeedbackThread } from '@ljoukov/sheet';

	let draft = $state('');

	const thread = {
		status: 'open' as const,
		turns: [
			{
				id: 'student-1',
				speaker: 'student' as const,
				text: 'I know 1980 is divisible by 44, 45, 55, 60 and more, but I am not sure if I counted every factor above 43.'
			},
			{
				id: 'tutor-1',
				speaker: 'tutor' as const,
				text: 'Keep the divisor idea. Recount them in increasing order and check whether each pair gives you a new value.'
			}
		]
	};
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
					{thread}
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
					thread={{
						status: 'responding',
						turns: [
							{
								id: 'student-2',
								speaker: 'student',
								text: 'Can you check whether 44 belongs in the count?'
							}
						]
					}}
					draft=""
					questionLabel="divisor count"
					thinkingText="The condition is `n > 43`, so **44** is definitely valid."
					assistantDraftText="Yes. `44` divides `1980`, and because the condition is `n > 43`, it should be included in the final list."
				/>
			</div>
		</div>
	</section>
</div>
