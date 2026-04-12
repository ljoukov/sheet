import { describe, expect, it } from 'vitest';

import { PaperSheetReviewSchema } from './schema.js';

describe('PaperSheetReviewSchema', () => {
	it('accepts optional per-question scores', () => {
		const parsed = PaperSheetReviewSchema.parse({
			score: {
				got: 5,
				total: 6
			},
			label: 'Review complete',
			message: 'Most answers were secure.',
			note: 'Teacher-reviewed marks are still pending.',
			questions: {
				q1: {
					status: 'incorrect',
					note: 'Method was mostly right.',
					score: {
						got: 2,
						total: 3
					}
				}
			}
		});

		expect(parsed.questions.q1?.score).toEqual({
			got: 2,
			total: 3
		});
	});
});
