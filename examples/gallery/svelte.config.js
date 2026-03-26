import adapter from '@sveltejs/adapter-auto';
import { fileURLToPath } from 'node:url';
import { relative, resolve, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, execept for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@ljoukov/sheet': fileURLToPath(new URL('../../src/lib/index.ts', import.meta.url)),
			'@ljoukov/sheet/styles.css': resolve(import.meta.dirname, '../../src/lib/styles.css')
		}
	}
};

export default config;
