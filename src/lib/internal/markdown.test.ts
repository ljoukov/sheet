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

	it('renders safe inline worksheet SVG diagrams', () => {
		const html = renderMarkdown(
			"Diagram:\n\n<svg xmlns='http://www.w3.org/2000/svg' width='260' height='180' viewBox='0 0 360 240'><rect width='360' height='240' fill='white'/><polygon points='60,120 180,40 300,120 180,200' fill='none' stroke='black' stroke-width='3'/><text x='48' y='128' font-size='24' font-family='Arial'>P</text></svg>"
		);

		expect(html).toContain('class="markdown-svg-figure"');
		expect(html).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
		expect(html).toContain('<polygon points="60,120 180,40 300,120 180,200"');
		expect(html).toContain('>P</text>');
		expect(html).not.toContain('&lt;svg');
	});

	it('escapes unsafe SVG snippets instead of rendering them', () => {
		const html = renderMarkdown(
			"<svg xmlns='http://www.w3.org/2000/svg' onload='alert(1)'><script>alert(1)</script></svg>"
		);

		expect(html).not.toContain('class="markdown-svg-figure"');
		expect(html).toContain('&lt;svg');
		expect(html).toContain('&lt;script&gt;');
	});
});
