<script lang="ts">
	import { BROWSER } from 'esm-env';
	import PanelLeftIcon from '@lucide/svelte/icons/panel-left';
	import './layout.css';
	import '../../../../src/lib/styles.css';
	import '../app.css';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.svg';
	import { galleryNavigation } from '$lib/gallery/data.js';
	import ThemeToggle from '$lib/gallery/theme-toggle.svelte';

	let { children } = $props();
	let sidebarOpen = $state(true);
	const isRenderRoute = $derived(
		page.url.pathname === '/render' || page.url.pathname.startsWith('/render/')
	);
	const renderTheme = $derived(
		isRenderRoute ? (page.url.searchParams.get('theme') === 'dark' ? 'dark' : 'light') : null
	);

	function isActive(href: string): boolean {
		if (href === '/') {
			return page.url.pathname === '/';
		}

		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	function toggleSidebar(): void {
		sidebarOpen = !sidebarOpen;
	}

	$effect(() => {
		if (!BROWSER || renderTheme === null) {
			return;
		}

		const html = document.documentElement;
		const body = document.body;
		const previousHtmlDark = html.classList.contains('dark');
		const previousBodyDark = body.classList.contains('dark');
		const shouldUseDark = renderTheme === 'dark';

		html.classList.toggle('dark', shouldUseDark);
		body.classList.toggle('dark', shouldUseDark);

		return () => {
			html.classList.toggle('dark', previousHtmlDark);
			body.classList.toggle('dark', previousBodyDark);
		};
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !isRenderRoute}
	<ModeWatcher defaultMode="system" disableTransitions />
{/if}

{#if isRenderRoute}
	{@render children()}
{:else}
	<div class={`gallery-app ${sidebarOpen ? '' : 'is-sidebar-collapsed'}`}>
		<aside class="gallery-sidebar">
			<div class="gallery-sidebar__header">
				<div class="gallery-sidebar__header-main">
					<div class="gallery-brand">
						<div class="gallery-brand__eyebrow">Gallery</div>
						<h1 class="gallery-brand__title">@ljoukov/sheet</h1>
					</div>

					<ThemeToggle />
				</div>
			</div>

			<div class="gallery-sidebar__content">
				<nav class="gallery-nav" aria-label="Gallery navigation">
					{#each galleryNavigation as item (item.href)}
						<a
							class={`gallery-nav__link ${isActive(item.href) ? 'is-active' : ''}`}
							href={resolve(item.href)}
						>
							<span class="gallery-nav__title">{item.label}</span>
							<span class="gallery-nav__caption">{item.caption}</span>
						</a>
					{/each}
				</nav>
			</div>
		</aside>

		<main class="gallery-main">
			<div class="gallery-main__bar">
				<button
					type="button"
					class="gallery-sidebar-trigger"
					aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
					aria-pressed={sidebarOpen}
					onclick={toggleSidebar}
				>
					<PanelLeftIcon class="gallery-sidebar-trigger__icon" aria-hidden="true" />
					<span class="sr-only">{sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}</span>
				</button>
			</div>

			<div class="gallery-main__content">{@render children()}</div>
		</main>
	</div>
{/if}
