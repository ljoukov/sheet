<script lang="ts">
	import { SheetFeedbackCard } from '@ljoukov/sheet';
	import { feedbackCardStates, type FeedbackCardState } from '$lib/gallery/component-demos.js';

	const cards: Array<{
		id: FeedbackCardState;
		title: string;
		description: string;
	}> = [
		{ id: 'pending', title: 'Pending', description: 'Fresh note before any reply arrives.' },
		{
			id: 'open',
			title: 'Conversation open',
			description: 'Student replied and the thread stays open.'
		},
		{
			id: 'thinking',
			title: 'Thinking',
			description: 'Runtime state while the tutor is reasoning.'
		},
		{
			id: 'resolved',
			title: 'Resolved',
			description: 'Closed thread with follow-up affordance.'
		}
	];

	let drafts = $state<Record<string, string>>({});

	function updateDraft(cardId: string, value: string): void {
		drafts = {
			...drafts,
			[cardId]: value
		};
	}
</script>

<div class="gallery-page">
	<header class="gallery-page__intro">
		<div class="gallery-page__eyebrow">Feedback cards</div>
		<h1 class="gallery-page__title">Question review states from pending to resolved.</h1>
		<p class="gallery-page__description">
			Use these standalone cards to inspect the tutor-note surface without the full worksheet
			container.
		</p>
	</header>

	<section class="gallery-stage">
		<div class="gallery-stage__header">
			<div>
				<p class="gallery-stage__title">States</p>
				<p class="gallery-stage__copy">
					Each example renders the exported component with a different review or thread state.
				</p>
			</div>
		</div>

		<div class="gallery-grid gallery-grid--two">
			{#each cards as card (card.id)}
				<div class="gallery-frame">
					<div class="gallery-stage__header">
						<div>
							<p class="gallery-stage__title">{card.title}</p>
							<p class="gallery-stage__copy">{card.description}</p>
						</div>
					</div>

					<SheetFeedbackCard
						review={feedbackCardStates[card.id].review}
						questionLabel="question demo"
						draft={drafts[card.id] ?? ''}
						thread={feedbackCardStates[card.id].thread}
						processing={feedbackCardStates[card.id].processing ?? false}
						runtimeStatus={feedbackCardStates[card.id].runtimeStatus ?? null}
						thinkingText={feedbackCardStates[card.id].thinkingText ?? null}
						assistantDraftText={feedbackCardStates[card.id].assistantDraftText ?? null}
						showComposer={!feedbackCardStates[card.id].showFollowUpButton}
						showFollowUpButton={feedbackCardStates[card.id].showFollowUpButton ?? false}
						onDraftChange={(value) => {
							updateDraft(card.id, value);
						}}
					/>
				</div>
			{/each}
		</div>
	</section>
</div>
