import { describe, expect, it } from 'vitest';

import { resolveBadgeLabel } from './question-label.js';

describe('question label helpers', () => {
	it('prefers badgeLabel over displayNumber when both are present', () => {
		expect(
			resolveBadgeLabel({
				displayNumber: '3(a)',
				badgeLabel: 'Q3'
			})
		).toBe('Q3');
	});

	it('falls back to displayNumber when badgeLabel is missing', () => {
		expect(
			resolveBadgeLabel({
				displayNumber: '3(a)'
			})
		).toBe('3(a)');
	});
});
