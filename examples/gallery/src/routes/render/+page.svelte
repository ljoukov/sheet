<script lang="ts">
	import { resolve } from '$app/paths';

	const renderRoutes = [
		{
			component: 'sheet',
			path: '/render/sheet',
			query: 'theme=light&state=roman',
			states: ['roman', 'iron', 'english']
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
		}
	] as const;

	const renderRouteLinks = renderRoutes.map((route) => ({
		...route,
		href: `${resolve(route.path)}?${route.query}`
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
			Each route renders a single exported component with no gallery sidebar or header chrome. Use
			the <code>theme</code> query param for light or dark mode and <code>state</code> to select the demo
			variant.
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
