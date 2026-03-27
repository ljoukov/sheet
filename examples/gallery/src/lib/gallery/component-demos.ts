import type { SheetFeedbackThreadData, SheetQuestionReview } from '@ljoukov/sheet';

export type FeedbackCardDemo = {
	id: string;
	review: SheetQuestionReview;
	thread: SheetFeedbackThreadData | null;
	processing?: boolean;
	runtimeStatus?: 'connecting' | 'thinking' | 'responding' | null;
	thinkingText?: string | null;
	assistantDraftText?: string | null;
	showFollowUpButton?: boolean;
};

export const reviewNeedsRevision: SheetQuestionReview = {
	status: 'teacher-review',
	label: 'Review note',
	statusLabel: 'reflection prompt',
	note: 'Your setup is right, but the final count still misses some divisors. Recount the factors greater than 43 and explain where 44 fits.',
	replyPlaceholder: 'Explain how you would fix the divisor count.',
	followUp: 'Good. Now restate the corrected conclusion in one clean final sentence.'
};

export const reviewCorrect: SheetQuestionReview = {
	status: 'correct',
	label: 'Strong move',
	statusLabel: 'optional reply',
	note: 'The corrected count is complete and the conclusion now matches the divisor list.',
	replyPlaceholder: 'Optional reply...',
	followUp: 'If you want to polish it further, explain why 44 is the first valid factor.'
};

export const feedbackCardStates: Record<FeedbackCardState, FeedbackCardDemo> = {
	pending: {
		id: 'pending',
		review: reviewNeedsRevision,
		thread: null
	},
	open: {
		id: 'open',
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
	thinking: {
		id: 'thinking',
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
	resolved: {
		id: 'resolved',
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
};

export type FeedbackCardState = 'pending' | 'open' | 'thinking' | 'resolved';

export type FeedbackThreadDemo = {
	thread: SheetFeedbackThreadData;
	draft: string;
	thinkingText?: string;
	assistantDraftText?: string;
};

export type FeedbackThreadState = 'open' | 'responding';

export const feedbackThreadStates: Record<FeedbackThreadState, FeedbackThreadDemo> = {
	open: {
		thread: {
			status: 'open',
			turns: [
				{
					id: 'student-1',
					speaker: 'student',
					text: 'I know 1980 is divisible by 44, 45, 55, 60 and more, but I am not sure if I counted every factor above 43.'
				},
				{
					id: 'tutor-1',
					speaker: 'tutor',
					text: 'Keep the divisor idea. Recount them in increasing order and check whether each pair gives you a new value.'
				}
			]
		},
		draft: ''
	},
	responding: {
		thread: {
			status: 'responding',
			turns: [
				{
					id: 'student-2',
					speaker: 'student',
					text: 'Can you check whether 44 belongs in the count?'
				}
			]
		},
		draft: '',
		thinkingText: 'The condition is `n > 43`, so **44** is definitely valid.',
		assistantDraftText:
			'Yes. `44` divides `1980`, and because the condition is `n > 43`, it should be included in the final list.'
	}
};

export type MarkdownDemo = {
	markdown: string;
	inline?: boolean;
};

export type MarkdownState = 'block' | 'inline';

export const markdownStates: Record<MarkdownState, MarkdownDemo> = {
	block: {
		markdown: `
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
`
	},
	inline: {
		markdown: 'Inline maths like `$F = ma$` and code like `const x = 19` should stay readable.',
		inline: true
	}
};

export const defaultSheetState = 'roman';
export const defaultFeedbackCardState: FeedbackCardState = 'open';
export const defaultFeedbackThreadState: FeedbackThreadState = 'open';
export const defaultMarkdownState: MarkdownState = 'block';
