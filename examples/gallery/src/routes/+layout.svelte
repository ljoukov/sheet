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

	function toTitle(segment: string): string {
		return segment
			.split('-')
			.map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : ''))
			.join(' ');
	}

	type Crumb = {
		label: string;
		href: string | null;
	};

	const breadcrumbs = $derived.by((): Crumb[] => {
		const pathname = page.url.pathname;
		const items: Crumb[] = [{ label: 'Gallery', href: resolve('/') }];

		if (pathname === '/') {
			return items;
		}

		const matchedNav = [...galleryNavigation]
			.map((item) => ({
				label: item.label,
				href: resolve(item.href)
			}))
			.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
			.sort((a, b) => b.href.length - a.href.length)[0];

		const consumedParts = matchedNav ? matchedNav.href.split('/').filter(Boolean) : [];
		const pathParts = pathname.split('/').filter(Boolean);

		if (matchedNav && matchedNav.href !== resolve('/')) {
			items.push({ label: matchedNav.label, href: matchedNav.href });
		}

		for (let index = consumedParts.length; index < pathParts.length; index += 1) {
			const href = `/${pathParts.slice(0, index + 1).join('/')}`;
			items.push({
				label: toTitle(pathParts[index] ?? ''),
				href: index === pathParts.length - 1 ? null : href
			});
		}

		if (items.length > 0) {
			items[items.length - 1] = {
				...items[items.length - 1],
				href: null
			};
		}

		return items;
	});

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

				<div class="gallery-main__bar-separator" aria-hidden="true"></div>

				<nav class="gallery-breadcrumb" aria-label="Current path">
					<ol class="gallery-breadcrumb__list">
						{#each breadcrumbs as crumb, index (crumb.label + ':' + index)}
							<li class={`gallery-breadcrumb__item ${index === 0 ? 'is-root' : ''}`}>
								{#if crumb.href}
									<a class="gallery-breadcrumb__link" href={crumb.href}>{crumb.label}</a>
								{:else}
									<span class="gallery-breadcrumb__page">{crumb.label}</span>
								{/if}
							</li>
							{#if index < breadcrumbs.length - 1}
								<li
									class={`gallery-breadcrumb__separator ${index === 0 ? 'is-after-root' : ''}`}
									aria-hidden="true"
								>
									/
								</li>
							{/if}
						{/each}
					</ol>
				</nav>
			</div>

			<div class="gallery-main__content">{@render children()}</div>
		</main>
	</div>
{/if}
