<script lang="ts">
	import {
		SheetFeedbackCard,
		type SheetFeedbackThreadData,
		type SheetQuestionReview
	} from '@ljoukov/sheet';

	type FeedbackCardDemo = {
		id: string;
		title: string;
		description: string;
		review: SheetQuestionReview;
		thread: SheetFeedbackThreadData | null;
		processing?: boolean;
		runtimeStatus?: 'connecting' | 'thinking' | 'responding' | null;
		thinkingText?: string | null;
		assistantDraftText?: string | null;
		showFollowUpButton?: boolean;
	};

	const reviewNeedsRevision: SheetQuestionReview = {
		status: 'teacher-review',
		label: 'Review note',
		statusLabel: 'reflection prompt',
		note: 'Your setup is right, but the final count still misses some divisors. Recount the factors greater than 43 and explain where 44 fits.',
		replyPlaceholder: 'Explain how you would fix the divisor count.',
		followUp: 'Good. Now restate the corrected conclusion in one clean final sentence.'
	};

	const reviewCorrect: SheetQuestionReview = {
		status: 'correct',
		label: 'Strong move',
		statusLabel: 'optional reply',
		note: 'The corrected count is complete and the conclusion now matches the divisor list.',
		replyPlaceholder: 'Optional reply...',
		followUp: 'If you want to polish it further, explain why 44 is the first valid factor.'
	};

	const cards: FeedbackCardDemo[] = [
		{
			id: 'pending',
			title: 'Pending',
			description: 'Fresh note before any reply arrives.',
			review: reviewNeedsRevision,
			thread: null
		},
		{
			id: 'open',
			title: 'Conversation open',
			description: 'Student replied and the thread stays open.',
			review: reviewNeedsRevision,
			thread: {
				status: 'open',
				turns: [
					{
						id: 'open-student',
						speaker: 'student',
						text: 'I think I forgot 44 and some of the larger factor pairs.'
					},
					{
						id: 'open-tutor',
						speaker: 'tutor',
						text: 'That is the right place to check. Recount in order so the missing values stand out.'
					}
				]
			}
		},
		{
			id: 'thinking',
			title: 'Thinking',
			description: 'Runtime state while the tutor is reasoning.',
			review: reviewNeedsRevision,
			thread: {
				status: 'responding',
				turns: [
					{
						id: 'thinking-student',
						speaker: 'student',
						text: 'Can you check whether 44 should be included?'
					}
				]
			},
			runtimeStatus: 'thinking',
			thinkingText:
				'I can keep the divisor idea and fix the count. The condition is `n > 43`, so 44 is allowed.'
		},
		{
			id: 'resolved',
			title: 'Resolved',
			description: 'Closed thread with follow-up affordance.',
			review: reviewCorrect,
			thread: {
				status: 'resolved',
				turns: [
					{
						id: 'resolved-student',
						speaker: 'student',
						text: 'I recounted the factors and there are 19 values.'
					},
					{
						id: 'resolved-tutor',
						speaker: 'tutor',
						text: 'Exactly. 44, 45, 396, 660, and 1980 were the missing values in the first list.'
					}
				]
			},
			showFollowUpButton: true
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
						review={card.review}
						questionLabel="question demo"
						draft={drafts[card.id] ?? ''}
						thread={card.thread}
						processing={card.processing ?? false}
						runtimeStatus={card.runtimeStatus ?? null}
						thinkingText={card.thinkingText ?? null}
						assistantDraftText={card.assistantDraftText ?? null}
						showComposer={!card.showFollowUpButton}
						showFollowUpButton={card.showFollowUpButton ?? false}
						onDraftChange={(value) => {
							updateDraft(card.id, value);
						}}
					/>
				</div>
			{/each}
		</div>
	</section>
</div>
