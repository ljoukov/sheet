import { describe, expect, it } from 'vitest';

import { renderMarkdown } from './markdown.js';

describe('renderMarkdown', () => {
	it('renders worksheet links with safe new-tab attributes', () => {
		const html = renderMarkdown('[Worksheet](https://example.com/worksheet)');

		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
		expect(html).toContain('class="markdown-link"');
	});

	it('renders linked images as clickable figures', () => {
		const html = renderMarkdown(
			'[![Mark scheme](https://cdn.example.com/mark-scheme.png "Q1 mark scheme")](https://cdn.example.com/mark-scheme.png)'
		);

		expect(html).toContain('class="markdown-figure-link"');
		expect(html).toContain('class="markdown-figure"');
		expect(html).toContain('class="markdown-figure__image"');
		expect(html).toContain('class="markdown-figure__caption">Q1 mark scheme</span>');
	});

	it('drops unsafe javascript links instead of rendering anchors', () => {
		const html = renderMarkdown('[bad](javascript:alert(1))');

		expect(html).not.toContain('<a ');
		expect(html).toContain('<p>bad</p>');
	});
});
