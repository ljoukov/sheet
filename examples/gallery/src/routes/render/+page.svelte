<script lang="ts">
	import { resolve } from '$app/paths';
	import { questionKinds } from '$lib/gallery/data.js';

	const renderRoutes = [
		{
			component: 'sheet',
			path: '/render/sheet',
			query: 'theme=light&state=roman',
			states: ['roman', 'iron', 'english']
		},
		{
			component: 'grading-summary',
			path: '/render/grading-summary',
			query: 'theme=light',
			states: ['default']
		},
		{
			component: 'feedback-card',
			path: '/render/feedback-card',
			query: 'theme=light&state=open',
			states: ['pending', 'open', 'thinking', 'resolved']
		},
		{
			component: 'feedback-thread',
			path: '/render/feedback-thread',
			query: 'theme=light&state=open',
			states: ['open', 'responding']
		},
		{
			component: 'markdown',
			path: '/render/markdown',
			query: 'theme=light&state=block',
			states: ['block', 'inline']
		},
		{
			component: 'question',
			path: '/render/question/[kind]',
			query: 'theme=light',
			states: [...questionKinds]
		}
	] as const;

	const renderRouteLinks = renderRoutes.map((route) => ({
		...route,
		href:
			route.component === 'question'
				? `${resolve('/render/question/[kind]', { kind: questionKinds[0] })}?${route.query}`
				: `${resolve(route.path)}?${route.query}`
	}));
</script>

<div
	class="gallery-render theme-light"
	data-component-root
	data-component="index"
	data-theme="light"
>
	<div class="gallery-render__docs">
		<h1 class="gallery-render__docs-title">Component render routes</h1>
		<p class="gallery-render__docs-copy">
			Each route renders a single capture surface with no gallery sidebar or header chrome. Use the
			<code>theme</code> query param for light or dark mode, the <code>state</code> query param for
			component variants, and the question <code>kind</code> path segment for focused one-question demos.
		</p>

		<div class="gallery-list">
			{#each renderRouteLinks as route (route.component)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a class="gallery-list__item" href={route.href}>
					<div>
						<h2 class="gallery-list__item-title">{route.component}</h2>
						<p class="gallery-list__item-copy">States: {route.states.join(', ')}</p>
					</div>
					<span class="gallery-pill">Open render</span>
				</a>
			{/each}
		</div>
	</div>
</div>
