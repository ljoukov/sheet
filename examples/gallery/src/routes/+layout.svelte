<script lang="ts">
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

	function isActive(href: string): boolean {
		if (href === '/') {
			return page.url.pathname === '/';
		}

		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	function toggleSidebar(): void {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher defaultMode="system" disableTransitions />

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
