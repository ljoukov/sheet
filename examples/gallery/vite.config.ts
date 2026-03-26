import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: [
			{
				find: '@ljoukov/sheet/styles.css',
				replacement: fileURLToPath(new URL('../../src/lib/styles.css', import.meta.url))
			},

			{
				find: '@ljoukov/sheet',
				replacement: fileURLToPath(new URL('../../src/lib/index.ts', import.meta.url))
			}
		]
	}
});
