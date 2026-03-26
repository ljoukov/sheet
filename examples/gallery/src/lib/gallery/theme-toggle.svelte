<script lang="ts">
	import { resetMode, setMode, userPrefersMode } from 'mode-watcher';

	type ThemeChoice = 'light' | 'dark' | 'system';

	const options: { value: ThemeChoice; label: string }[] = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];

	const selectedMode = $derived((userPrefersMode.current ?? 'system') as ThemeChoice);

	function handleThemeChange(nextMode: ThemeChoice): void {
		if (nextMode === 'system') {
			resetMode();
			return;
		}

		setMode(nextMode);
	}
</script>

<div class="gallery-theme" role="group" aria-label="Choose preview theme">
	{#each options as option (option.value)}
		<button
			type="button"
			class={`gallery-theme__button ${selectedMode === option.value ? 'is-active' : ''}`}
			aria-pressed={selectedMode === option.value}
			onclick={() => {
				handleThemeChange(option.value);
			}}
		>
			{option.label}
		</button>
	{/each}
</div>
