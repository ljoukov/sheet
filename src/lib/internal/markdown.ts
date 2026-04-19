import { marked, type TokenizerAndRendererExtension } from 'marked';
import type { Tokens } from 'marked';
import markedKatex from 'marked-katex-extension';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import katex from 'katex';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);

const LANGUAGE_ALIASES = new Map<string, string>([
	['js', 'javascript'],
	['javascript', 'javascript'],
	['ts', 'typescript'],
	['typescript', 'typescript'],
	['py', 'python'],
	['python', 'python'],
	['c', 'c'],
	['c++', 'cpp'],
	['cpp', 'cpp'],
	['cc', 'cpp'],
	['cxx', 'cpp']
]);

const LANGUAGE_LABELS = new Map<string, string>([
	['javascript', 'js'],
	['typescript', 'ts'],
	['python', 'python'],
	['c', 'c'],
	['cpp', 'c++']
]);

const INLINE_PAREN_MATH_RULE = /^\\\(((?:\\.|[^\\\n])+?)\\\)/;
const INLINE_BRACKET_MATH_RULE = /^\\\[(((?:\\.|[^\\\n])+?))\\\]/;
const BLOCK_BRACKET_MATH_RULE = /^\\\[\n((?:\\[^]|[^\\])+?)\n\\\](?:\n|$)/;
const SVG_SNIPPET_RULE = /<svg\b[\s\S]*?<\/svg>/giu;
const SVG_TOKEN_RULE = /<!--[\s\S]*?-->|<[^>]+>|[^<]+/gu;
const SVG_ATTR_RULE = /([^\s=/<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gu;
const SAFE_SVG_TAGS = new Set([
	'svg',
	'g',
	'path',
	'rect',
	'circle',
	'ellipse',
	'line',
	'polyline',
	'polygon',
	'text',
	'tspan',
	'defs',
	'lineargradient',
	'radialgradient',
	'stop'
]);
const SAFE_SVG_ATTRIBUTES = new Set([
	'aria-hidden',
	'aria-label',
	'class',
	'clip-rule',
	'cx',
	'cy',
	'd',
	'dominant-baseline',
	'fill',
	'fill-opacity',
	'fill-rule',
	'focusable',
	'font-family',
	'font-size',
	'font-style',
	'font-weight',
	'height',
	'id',
	'offset',
	'opacity',
	'points',
	'r',
	'role',
	'rx',
	'ry',
	'stop-color',
	'stop-opacity',
	'stroke',
	'stroke-dasharray',
	'stroke-dashoffset',
	'stroke-linecap',
	'stroke-linejoin',
	'stroke-opacity',
	'stroke-width',
	'text-anchor',
	'transform',
	'viewbox',
	'width',
	'x',
	'x1',
	'x2',
	'xml:space',
	'xmlns',
	'y',
	'y1',
	'y2'
]);
const UNSAFE_SVG_CONTENT_RULE =
	/<\s*(?:script|foreignobject|iframe|object|embed|image|use|animate|animatemotion|animatetransform|set|style|a)\b/iu;

marked.setOptions({ breaks: true, gfm: true });
marked.use(
	markedKatex({
		throwOnError: false,
		// Allow inline math without requiring surrounding spaces (e.g. "($N!$)").
		nonStandard: true
	})
);
marked.use({
	extensions: [createInlineBackslashMathExtension(), createBlockBackslashMathExtension()]
});

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function resolveLanguageLabel(raw: string, normalized: string): string {
	if (normalized && LANGUAGE_LABELS.has(normalized)) {
		return LANGUAGE_LABELS.get(normalized) ?? raw;
	}
	return raw || normalized || 'text';
}

function sanitizeUrl(value: string, kind: 'link' | 'image'): string | null {
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return null;
	}

	if (
		trimmed.startsWith('#') ||
		trimmed.startsWith('/') ||
		trimmed.startsWith('./') ||
		trimmed.startsWith('../') ||
		trimmed.startsWith('?')
	) {
		return trimmed;
	}

	const schemeMatch = trimmed.match(/^([a-z][a-z0-9+.-]*):/iu);
	if (!schemeMatch) {
		return trimmed;
	}

	const scheme = schemeMatch[1]?.toLowerCase();
	if (!scheme) {
		return null;
	}

	if (kind === 'link') {
		if (scheme === 'http' || scheme === 'https' || scheme === 'mailto' || scheme === 'tel') {
			return trimmed;
		}
		return null;
	}

	if (scheme === 'http' || scheme === 'https' || scheme === 'data' || scheme === 'blob') {
		return trimmed;
	}

	return null;
}

function renderTitleAttribute(title: string | null | undefined): string {
	return title ? ` title="${escapeHtml(title)}"` : '';
}

function sanitizeSvgAttributeValue(value: string): string | null {
	if (/[<>`]/u.test(value)) {
		return null;
	}
	const compact = value.replace(/\s+/gu, '').toLowerCase();
	if (compact.includes('javascript:')) {
		return null;
	}
	if (/url\((?!#)/iu.test(compact)) {
		return null;
	}
	return escapeHtml(value);
}

function sanitizeSvgAttributes(rawAttributes: string): string | null {
	let attributes = '';
	let consumedLength = 0;
	SVG_ATTR_RULE.lastIndex = 0;

	for (const match of rawAttributes.matchAll(SVG_ATTR_RULE)) {
		const rawBefore = rawAttributes.slice(consumedLength, match.index);
		if (rawBefore.trim().length > 0) {
			return null;
		}
		consumedLength = (match.index ?? 0) + match[0].length;

		const rawName = match[1] ?? '';
		if (!/^[A-Za-z_:][A-Za-z0-9_.:-]*$/u.test(rawName)) {
			return null;
		}
		const normalizedName = rawName.toLowerCase();
		if (normalizedName.startsWith('on') || normalizedName.includes('href')) {
			return null;
		}
		if (!SAFE_SVG_ATTRIBUTES.has(normalizedName)) {
			continue;
		}

		const rawValue = match[2] ?? match[3] ?? match[4] ?? '';
		if (rawValue.length === 0) {
			attributes += ` ${escapeHtml(rawName)}`;
			continue;
		}
		const safeValue = sanitizeSvgAttributeValue(rawValue);
		if (safeValue === null) {
			return null;
		}
		attributes += ` ${escapeHtml(rawName)}="${safeValue}"`;
	}

	if (rawAttributes.slice(consumedLength).trim().length > 0) {
		return null;
	}

	return attributes;
}

function renderSafeSvg(raw: string): string | null {
	const trimmed = raw.trim();
	if (!/^<svg(?:\s|>)/iu.test(trimmed) || !/<\/svg>\s*$/iu.test(trimmed)) {
		return null;
	}
	if (UNSAFE_SVG_CONTENT_RULE.test(trimmed)) {
		return null;
	}

	let output = '';
	let depth = 0;
	let sawSvg = false;
	const tokens = trimmed.match(SVG_TOKEN_RULE) ?? [];

	for (const token of tokens) {
		if (token.startsWith('<!--')) {
			continue;
		}
		if (!token.startsWith('<')) {
			if ((!sawSvg || depth === 0) && token.trim().length > 0) {
				return null;
			}
			output += escapeHtml(token);
			continue;
		}
		if (/^<\s*[!?]/u.test(token)) {
			return null;
		}

		const closingMatch = token.match(/^<\s*\/\s*([A-Za-z][A-Za-z0-9_.:-]*)\s*>$/u);
		if (closingMatch) {
			const tagName = (closingMatch[1] ?? '').toLowerCase();
			if (!SAFE_SVG_TAGS.has(tagName)) {
				return null;
			}
			depth -= 1;
			if (depth < 0) {
				return null;
			}
			output += `</${tagName}>`;
			continue;
		}

		const openingMatch = token.match(/^<\s*([A-Za-z][A-Za-z0-9_.:-]*)([\s\S]*?)\s*(\/?)>$/u);
		if (!openingMatch) {
			return null;
		}
		const tagName = (openingMatch[1] ?? '').toLowerCase();
		if (!SAFE_SVG_TAGS.has(tagName)) {
			return null;
		}
		if (!sawSvg && tagName !== 'svg') {
			return null;
		}
		if (sawSvg && depth === 0) {
			return null;
		}
		sawSvg = true;

		const attributes = sanitizeSvgAttributes(openingMatch[2] ?? '');
		if (attributes === null) {
			return null;
		}
		const selfClosing = openingMatch[3] === '/';
		output += `<${tagName}${attributes}${selfClosing ? ' />' : '>'}`;
		if (!selfClosing) {
			depth += 1;
		}
	}

	if (!sawSvg || depth !== 0) {
		return null;
	}

	return `<span class="markdown-svg-figure" role="figure">${output}</span>`;
}

type SafeSvgExtraction = { markdown: string; snippets: string[] };

function extractSafeSvgSnippets(markdown: string): SafeSvgExtraction {
	const snippets: string[] = [];
	const nextMarkdown = markdown.replace(SVG_SNIPPET_RULE, (raw) => {
		const rendered = renderSafeSvg(raw);
		if (!rendered) {
			return raw;
		}
		const index = snippets.push(rendered) - 1;
		return `\n\nSHEET_SVG_PLACEHOLDER_${index}\n\n`;
	});
	return { markdown: nextMarkdown, snippets };
}

function restoreSafeSvgSnippets(html: string, snippets: string[]): string {
	let restored = html;
	for (let index = 0; index < snippets.length; index += 1) {
		const placeholder = `SHEET_SVG_PLACEHOLDER_${index}`;
		const snippet = snippets[index] ?? '';
		restored = restored
			.replaceAll(`<p>${placeholder}</p>`, snippet)
			.replaceAll(`<p>${escapeHtml(placeholder)}</p>`, snippet)
			.replaceAll(placeholder, snippet)
			.replaceAll(escapeHtml(placeholder), snippet);
	}
	return restored;
}

function isImageOnlyLink(tokens: Tokens.Link['tokens']): boolean {
	return tokens.length === 1 && tokens[0]?.type === 'image';
}

type CodeSpanMath = { expr: string; displayMode: boolean };
type BackslashMathToken = {
	type: 'inlineBackslashMath' | 'blockBackslashMath';
	raw: string;
	text: string;
	displayMode: boolean;
};

function renderKatex(expr: string, displayMode: boolean): string {
	return katex.renderToString(expr, {
		displayMode,
		throwOnError: false
	});
}

function createInlineBackslashMathExtension(): TokenizerAndRendererExtension {
	return {
		name: 'inlineBackslashMath',
		level: 'inline',
		start(src) {
			const parenIndex = src.indexOf('\\(');
			const bracketIndex = src.indexOf('\\[');
			if (parenIndex === -1) {
				if (bracketIndex === -1) {
					return;
				}
				return bracketIndex;
			}
			if (bracketIndex === -1) {
				return parenIndex;
			}
			return Math.min(parenIndex, bracketIndex);
		},
		tokenizer(src) {
			const parenMatch = src.match(INLINE_PAREN_MATH_RULE);
			if (parenMatch) {
				const text = parenMatch[1]?.trim() ?? '';
				if (text.length === 0) {
					return;
				}
				return {
					type: 'inlineBackslashMath',
					raw: parenMatch[0],
					text,
					displayMode: false
				} as BackslashMathToken;
			}

			const bracketMatch = src.match(INLINE_BRACKET_MATH_RULE);
			if (bracketMatch) {
				const text = bracketMatch[1]?.trim() ?? '';
				if (text.length === 0) {
					return;
				}
				return {
					type: 'inlineBackslashMath',
					raw: bracketMatch[0],
					text,
					displayMode: true
				} as BackslashMathToken;
			}
		},
		renderer(token) {
			const backslashMathToken = token as BackslashMathToken;
			return renderKatex(backslashMathToken.text, backslashMathToken.displayMode);
		}
	};
}

function createBlockBackslashMathExtension(): TokenizerAndRendererExtension {
	return {
		name: 'blockBackslashMath',
		level: 'block',
		tokenizer(src) {
			const match = src.match(BLOCK_BRACKET_MATH_RULE);
			if (!match) {
				return;
			}
			const text = match[1]?.trim() ?? '';
			if (text.length === 0) {
				return;
			}
			return {
				type: 'blockBackslashMath',
				raw: match[0],
				text,
				displayMode: true
			} as BackslashMathToken;
		},
		renderer(token) {
			const backslashMathToken = token as BackslashMathToken;
			return `${renderKatex(backslashMathToken.text, backslashMathToken.displayMode)}\n`;
		}
	};
}

function parseCodeSpanMath(value: string): CodeSpanMath | null {
	const trimmed = value.trim();
	if (trimmed.length < 3) {
		return null;
	}
	if (trimmed.includes('\n') || trimmed.includes('\r')) {
		return null;
	}

	if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
		const expr = trimmed.slice(2, -2).trim();
		if (expr.length === 0 || expr.includes('$')) {
			return null;
		}
		return { expr, displayMode: true };
	}

	if (trimmed.startsWith('\\[') && trimmed.endsWith('\\]') && trimmed.length > 4) {
		const expr = trimmed.slice(2, -2).trim();
		if (expr.length === 0) {
			return null;
		}
		return { expr, displayMode: true };
	}

	if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
		const expr = trimmed.slice(1, -1).trim();
		if (expr.length === 0 || expr.includes('$')) {
			return null;
		}
		return { expr, displayMode: false };
	}

	if (trimmed.startsWith('\\(') && trimmed.endsWith('\\)') && trimmed.length > 4) {
		const expr = trimmed.slice(2, -2).trim();
		if (expr.length === 0) {
			return null;
		}
		return { expr, displayMode: false };
	}

	return null;
}

const renderer = new marked.Renderer();
renderer.html = ({ text }) => renderSafeSvg(text) ?? escapeHtml(text);
renderer.codespan = (token) => {
	const code = typeof token.text === 'string' ? token.text : '';
	const math = parseCodeSpanMath(code);
	if (math) {
		return renderKatex(math.expr, math.displayMode);
	}
	return `<code>${escapeHtml(code)}</code>`;
};
renderer.code = (token) => {
	const code = typeof token.text === 'string' ? token.text : '';
	const rawLanguage = (token.lang ?? '').trim().split(/\s+/u)[0]?.toLowerCase() ?? '';
	const normalized = LANGUAGE_ALIASES.get(rawLanguage) ?? rawLanguage;
	const resolvedLanguage = normalized && hljs.getLanguage(normalized) ? normalized : '';
	const languageLabel = resolveLanguageLabel(rawLanguage, normalized);
	const highlighted = resolvedLanguage
		? hljs.highlight(code, { language: resolvedLanguage }).value
		: escapeHtml(code);
	const languageClass = resolvedLanguage
		? `hljs language-${resolvedLanguage}`
		: 'hljs language-text';

	return [
		'<div class="code-block">',
		'<div class="code-block__header">',
		`<span class="code-block__lang">${escapeHtml(languageLabel)}</span>`,
		'<button class="code-block__copy" type="button" data-code-copy aria-label="Copy code">',
		'<svg class="code-block__copy-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
		'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>',
		'<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>',
		'</svg>',
		'<span class="sr-only">Copy code</span>',
		'</button>',
		'</div>',
		`<pre><code class="${languageClass}">${highlighted}</code></pre>`,
		'</div>'
	].join('');
};
renderer.link = ({ href, title, tokens }) => {
	const safeHref = sanitizeUrl(href, 'link');
	const content = renderer.parser.parseInline(tokens);
	if (!safeHref) {
		return content;
	}

	const titleAttr = renderTitleAttribute(title);
	const opensInNewTab = !safeHref.startsWith('#');
	const className = isImageOnlyLink(tokens) ? 'markdown-figure-link' : 'markdown-link';

	return [
		`<a class="${className}" href="${escapeHtml(safeHref)}"${titleAttr}`,
		opensInNewTab ? ' target="_blank" rel="noopener noreferrer">' : '>',
		content,
		'</a>'
	].join('');
};
renderer.image = ({ href, title, text }) => {
	const safeHref = sanitizeUrl(href, 'image');
	if (!safeHref) {
		return escapeHtml(text);
	}

	const titleAttr = renderTitleAttribute(title);
	const caption = title ? `<span class="markdown-figure__caption">${escapeHtml(title)}</span>` : '';

	return [
		'<span class="markdown-figure" role="figure">',
		`<img class="markdown-figure__image" src="${escapeHtml(safeHref)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async"${titleAttr} />`,
		caption,
		'</span>'
	].join('');
};

function normalizeLatexLists(markdown: string): string {
	const lines = markdown.split(/\r?\n/u);
	const normalized: string[] = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (/^\\begin\{(enumerate|itemize)\}/.test(trimmed)) {
			normalized.push('');
			continue;
		}
		if (/^\\end\{(enumerate|itemize)\}/.test(trimmed)) {
			normalized.push('');
			continue;
		}
		const itemMatch = trimmed.match(/^\\item(?:\[(.+?)\])?\s*(.*)$/);
		if (itemMatch) {
			const label = itemMatch[1]?.trim();
			const rest = itemMatch[2]?.trim() ?? '';
			const prefix = label ? `- ${label}` : '-';
			normalized.push(rest.length > 0 ? `${prefix} ${rest}` : prefix);
			continue;
		}
		normalized.push(line);
	}

	return normalized.join('\n');
}

function normalizeDisplayMathBlocks(markdown: string): string {
	const lines = markdown.split(/\r?\n/u);
	let inFence = false;
	let inMathBlock = false;
	const normalized: string[] = [];

	const ensureBlankLineBefore = () => {
		if (normalized.length === 0) {
			return;
		}
		const last = normalized[normalized.length - 1];
		if (last !== undefined && last.trim() !== '') {
			normalized.push('');
		}
	};

	const ensureBlankLineAfter = (nextLine: string | undefined) => {
		if (!nextLine) {
			return;
		}
		if (nextLine.trim() !== '') {
			normalized.push('');
		}
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();
		if (trimmed.startsWith('```')) {
			inFence = !inFence;
			normalized.push(line);
			continue;
		}
		if (inFence) {
			normalized.push(line);
			continue;
		}

		const blockMathStartMatch = line.match(/^\s*\\\[(.*)$/u);
		if (blockMathStartMatch) {
			const remainder = blockMathStartMatch[1] ?? '';
			if (remainder.includes('\\]')) {
				normalized.push(line);
				continue;
			}
			ensureBlankLineBefore();
			inMathBlock = true;
			normalized.push('$$');
			if (remainder.length > 0) {
				normalized.push(remainder);
			}
			continue;
		}

		if (trimmed === '[') {
			ensureBlankLineBefore();
			inMathBlock = true;
			normalized.push('$$');
			continue;
		}

		const blockMathEndMatch = line.match(/^(.*)\\\]\s*$/u);
		if (blockMathEndMatch) {
			if (inMathBlock) {
				const remainder = blockMathEndMatch[1] ?? '';
				if (remainder.length > 0) {
					normalized.push(remainder);
				}
				inMathBlock = false;
				normalized.push('$$');
				const next = lines[i + 1];
				ensureBlankLineAfter(next);
				continue;
			}
			normalized.push(line);
			continue;
		}

		if (trimmed === ']') {
			if (inMathBlock) {
				inMathBlock = false;
				normalized.push('$$');
				const next = lines[i + 1];
				ensureBlankLineAfter(next);
				continue;
			}
			normalized.push(line);
			continue;
		}

		if (trimmed === '$$') {
			ensureBlankLineBefore();
			normalized.push('$$');
			if (inMathBlock) {
				inMathBlock = false;
				const next = lines[i + 1];
				ensureBlankLineAfter(next);
			} else {
				inMathBlock = true;
			}
			continue;
		}

		normalized.push(line);
	}

	return normalized.join('\n');
}

export function renderMarkdown(markdown: string): string {
	const { markdown: svgSafeMarkdown, snippets } = extractSafeSvgSnippets(markdown);
	const normalized = normalizeDisplayMathBlocks(normalizeLatexLists(svgSafeMarkdown));
	const parsed = marked.parse(normalized, { renderer });
	return typeof parsed === 'string' ? restoreSafeSvgSnippets(parsed, snippets) : '';
}

export function renderMarkdownInline(markdown: string): string {
	const rendered = renderMarkdown(markdown).trim();
	if (
		rendered.startsWith('<p>') &&
		rendered.endsWith('</p>') &&
		!rendered.includes('</p><p>') &&
		!rendered.includes('</p>\n<p>')
	) {
		return rendered.slice(3, -4);
	}
	return rendered;
}

export function renderMarkdownOptional(value?: string | null): string | undefined {
	if (!value) {
		return undefined;
	}

	const rendered = renderMarkdown(value);
	const trimmed = rendered.trim();
	return trimmed.length > 0 ? rendered : undefined;
}
