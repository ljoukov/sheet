import { describe, expect, it } from 'vitest';

import { formatQuestionMarksLabel, shouldShowQuestionFeedback } from './question-review.js';

describe('question review helpers', () => {
	it('falls back to the legacy marks badge when per-question score is missing', () => {
		expect(
			formatQuestionMarksLabel(3, {
				status: 'incorrect',
				note: 'Try again.'
			})
		).toBe('[3m]');
	});

	it('renders awarded and total marks when per-question score is present', () => {
		expect(
			formatQuestionMarksLabel(3, {
				status: 'incorrect',
				note: 'Partial credit.',
				score: {
					got: 2,
					total: 3
				}
			})
		).toBe('[2/3 marks]');
		expect(
			formatQuestionMarksLabel(1, {
				status: 'correct',
				note: 'Nice.',
				score: {
					got: 1,
					total: 1
				}
			})
		).toBe('[1/1 mark]');
	});

	it('can suppress completed feedback cards while keeping active threads visible', () => {
		expect(
			shouldShowQuestionFeedback(
				{
					status: 'correct',
					note: 'Nice.'
				},
				null,
				false
			)
		).toBe(false);

		expect(
			shouldShowQuestionFeedback(
				{
					status: 'correct',
					note: 'Nice.'
				},
				{
					status: 'open',
					turns: [
						{
							id: 'turn-1',
							speaker: 'student',
							text: 'Why was this right?'
						}
					]
				},
				false
			)
		).toBe(true);

		expect(
			shouldShowQuestionFeedback(
				{
					status: 'incorrect',
					note: 'Almost there.'
				},
				{
					status: 'resolved',
					turns: []
				},
				false
			)
		).toBe(false);
	});
});
